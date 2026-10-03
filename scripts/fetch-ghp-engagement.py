#!/usr/bin/env python3
"""Append aggregate lead outcomes and screen selections; source systems are read-only."""
import concurrent.futures
import importlib.util
import json
import re
import urllib.parse
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ghp', ROOT / 'scripts/fetch-ghp-report.py')
ghp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ghp)
source = ROOT / 'data/reports/ghp-portfolio-2026-10-03.json'
data = json.loads(source.read_text())
props = data['properties']
cutoff = data['cutoff_exclusive_utc']
e = ghp.env()
base = (e.get('NEXT_PUBLIC_SUPABASE_URL') or e.get('SUPABASE_URL')).rstrip('/')
key = e.get('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') or e.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') or e.get('SUPABASE_ANON_KEY') or e.get('SUPABASE_KEY')
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}


def rest(table, params):
    rows = []
    for start in range(0, 100000, 1000):
        page, _ = ghp.request(base + '/rest/v1/' + table + '?' + urllib.parse.urlencode(params), headers={**headers, 'Range': f'{start}-{start+999}'})
        rows.extend(page)
        if len(page) < 1000:
            return rows
    raise RuntimeError('Pagination limit exceeded')


def property_data(p):
    # Do not retain prospect identifiers, contact details, messages or raw metadata.
    rows = rest('Lead', {'select': 'id,details->metadata', 'magnet_uuid': 'eq.' + p['uuid'], 'time': 'lt.' + cutoff, 'order': 'id.asc'})
    counts = Counter(scheduled_leads=0, question_leads=0, both=0)
    for row in rows:
        entries = row.get('metadata') or []
        if isinstance(entries, dict):
            entries = [entries]
        if not isinstance(entries, list):
            continue
        entries = [v for v in entries if isinstance(v, dict)]
        scheduled = any(v.get('tour_time_start') and (v.get('tour_date') or v.get('appointment_date')) for v in entries)
        question = any(str(v.get('lead_type', '')).lower() == 'question' and (v.get('message') or v.get('reason') or v.get('notes')) for v in entries)
        counts['scheduled_leads'] += bool(scheduled)
        counts['question_leads'] += bool(question)
        counts['both'] += bool(scheduled and question)
    assert len(rows) == p['leads'], 'Lead population changed; reconcile with saved snapshot before publishing'
    magnets = rest('Magnet', {'select': 'magnet_details', 'uuid': 'eq.' + p['uuid']})
    cats = magnets[0]['magnet_details']['template']['categories']
    catalog = {}
    for category in ['amenities', 'floor_plans']:
        for slug, screen in cats[category]['screens'].items():
            route = category + '.' + slug
            if slug in ['main', 'main_page'] or 'form_screen' in slug:
                continue
            iframe = screen.get('iframe') or {}
            if not screen.get('video') and not (isinstance(iframe, dict) and iframe.get('enabled')):
                continue
            catalog[route] = {'title': screen.get('title') or slug, 'category': category, 'format': '3D' if isinstance(iframe, dict) and iframe.get('enabled') else 'Video'}
    return dict(counts), catalog

mapping = ','.join(f"STRUCT('{p['uuid']}' AS uuid, '{identifier}' AS event_id, '{urllib.parse.urlparse(p['website']).hostname}' AS production_host)" for p in props for identifier in [p['uuid'], p['alias'], '@' + p['alias']])
prefix = f"""WITH mapping AS (SELECT * FROM UNNEST([{mapping}])), e AS (
 SELECT m.uuid,m.production_host,e.* EXCEPT(magnet_uuid)
 FROM mapping m JOIN `default.events` e ON e.magnet_uuid=m.event_id
 WHERE e._timestamp < TIMESTAMP('{cutoff}') AND parsed_ua_bot IS NOT TRUE
) """
valid_visit = "visit_uuid IS NOT NULL AND LOWER(TRIM(visit_uuid)) NOT IN ('','undefined','null')"
queries = {
    'tour_viewers': prefix + """SELECT COALESCE(uuid,'portfolio'),COUNT(DISTINCT user_anonymous_id)
 FROM e WHERE event_type='open_tour' AND user_anonymous_id IS NOT NULL
 AND LOWER(TRIM(user_anonymous_id)) NOT IN ('','undefined','null')
 GROUP BY GROUPING SETS ((uuid),())""",
    'screen_selections': prefix + """SELECT uuid,COALESCE(NULLIF(details_to,''),`to`) AS destination,COUNT(*)
 FROM e WHERE event_type='button_click' GROUP BY 1,2 ORDER BY 1,3 DESC""",
    'application_follow_through': prefix + f""", tagged AS (
 SELECT *,MIN(IF(event_type='open_tour' AND LOWER(doc_host)=production_host
 AND NOT REGEXP_CONTAINS(LOWER(COALESCE(doc_path,'')),r'apply|application'),_timestamp,NULL))
 OVER(PARTITION BY uuid,visit_uuid) AS first_tour
 FROM e WHERE {valid_visit}
 ) SELECT uuid,COUNT(DISTINCT visit_uuid),COUNT(DISTINCT user_anonymous_id)
 FROM tagged WHERE LOWER(doc_host)=production_host AND LOWER(doc_path)='/application/' AND _timestamp>first_tour
 GROUP BY uuid""",
    'widget_follow_through': prefix + f""", tagged AS (
 SELECT *,MIN(IF(event_type='open_tour',_timestamp,NULL)) OVER(PARTITION BY uuid,visit_uuid) AS first_tour,
 CASE WHEN details_iframe_src LIKE CONCAT('%/cta/scheduler/integration/',uuid,'%') THEN 'scheduler'
 WHEN details_form_route='[\"thank_you\",\"thank_youquestion\"]'
 OR details_iframe_src LIKE CONCAT('%/cta/contactus/integration/',uuid,'%') THEN 'question' END AS outcome
 FROM e WHERE {valid_visit}
 ) SELECT uuid,outcome,COUNT(DISTINCT visit_uuid) FROM tagged
 WHERE event_type='form_submission' AND outcome IS NOT NULL AND _timestamp>first_tour GROUP BY 1,2""",
}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    property_futures = {p['uuid']: pool.submit(property_data, p) for p in props}
    query_futures = {key: pool.submit(ghp.bq, query) for key, query in queries.items()}
    details = {key: f.result() for key, f in property_futures.items()}
    results = {key: f.result() for key, f in query_futures.items()}

scopes = {}
for p in props:
    uid = p['uuid']
    counts, catalog = details[uid]
    selections = Counter()
    for scope, destination, count in results['screen_selections']:
        if scope != uid or not destination:
            continue
        try:
            parsed = json.loads(destination)
            route = '.'.join(parsed) if isinstance(parsed, list) else parsed
        except (ValueError, TypeError):
            route = destination
        if isinstance(route, str) and route in catalog:
            selections[route] += count
    ranks = {}
    for category in ['amenities', 'floor_plans']:
        ranked = [{'route': route, **catalog[route], 'selections': count} for route, count in selections.items() if catalog[route]['category'] == category]
        ranks[category] = sorted(ranked, key=lambda r: (-r['selections'], r['title'], r['route']))[:5]
        assert len(ranks[category]) == 5
    scopes[uid] = {'name': p['name'], **counts, 'application_page_sessions': 0, 'tour_then_scheduler_sessions': 0, 'tour_then_question_sessions': 0, **ranks}
for uid, sessions, users in results['application_follow_through']:
    scopes[uid]['application_page_sessions'] = sessions
for uid, outcome, sessions in results['widget_follow_through']:
    scopes[uid]['tour_then_' + outcome + '_sessions'] = sessions
portfolio_viewers = 0
for uid, viewers in results['tour_viewers']:
    if uid == 'portfolio':
        portfolio_viewers = viewers
    else:
        scopes[uid]['tour_viewers'] = viewers

data['engagement'] = {
    'retrieved_at': datetime.now(timezone.utc).isoformat(),
    'definitions': {
        'tour_viewers': 'Distinct nonempty user_anonymous_id values on open_tour events before the cutoff, excluding flagged bots and invalid IDs. Portfolio count is deduplicated across properties. These are tracked anonymous IDs, not verified people. Saved lead counts are measured independently, not a linked conversion funnel.',
        'lead_outcomes': 'Unique saved lead rows created before the report cutoff, using metadata as retrieved. Scheduling requires a tour start time and tour/appointment date. Question requires explicit Question lead type with a nonempty message/reason/notes. Metadata histories are deduplicated within each lead. Categories may overlap and are subsets of captured leads. Metadata can be updated after lead creation; these are not immutable event-time totals or confirmed attendance.',
        'widget_follow_through': 'Distinct valid visits with a recorded open_tour followed strictly later by the canonical scheduler or question form_submission within the same property and visit. Question matches the legacy question route or the canonical contactus integration currently labeled Ask a Question. Excludes flagged bots. These visit counts are independent from saved-lead counts and cannot be added to them.',
        'application_follow_through': 'Distinct valid visits with open_tour on the production property website outside application pages, followed strictly later in the same property/visit by a tracked event on that production website /application/ page. Excludes flagged bots and demo domains. Evidence of application-page follow-through only, not an Apply Now button click, application submission or lease.',
        'screen_rankings': 'Top five current amenity/floor-plan routes by recorded button_click destination selections before cutoff, excluding flagged bots, category overview and form screens. Aliases normalized to canonical tour. Labels come from the current tour configuration; screens may have changed historically. Repeat selections count. Rankings are not unique viewers, video watch duration or completions; 3D screens may be included.',
    },
    'scopes': scopes,
    'totals': {key: sum(scope[key] for scope in scopes.values()) for key in ['scheduled_leads','question_leads','both','application_page_sessions','tour_then_scheduler_sessions','tour_then_question_sessions']},
    'queries': queries,
}
data['engagement']['totals']['tour_viewers'] = portfolio_viewers
source.write_text(json.dumps(data, indent=2) + '\n')
for scope in scopes.values():
    print(json.dumps(scope))
print('TOTALS', json.dumps(data['engagement']['totals']))

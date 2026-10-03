#!/usr/bin/env python3
"""Append aggregate screen-view counts inferred from retained tour events."""
import importlib.util
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ghp', ROOT / 'scripts/fetch-ghp-report.py')
ghp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ghp)
source = ROOT / 'data/reports/ghp-portfolio-2026-10-03.json'
data = json.loads(source.read_text())
mapping = ','.join(f"STRUCT('{p['uuid']}' AS uuid, '{identifier}' AS identifier)" for p in data['properties'] for identifier in [p['uuid'], p['alias'], '@' + p['alias']])
query = f"""WITH mapping AS (SELECT * FROM UNNEST([{mapping}])), raw AS (
 SELECT m.uuid,e._timestamp,e.event_type,e.visit_uuid,e.eventn_ctx_event_id,
 COALESCE(NULLIF(e.details_to,''),NULLIF(e.`to`,''),NULLIF(e.details_route,'')) AS destination,
 COALESCE(e.details_from,e.`from`) AS origin
 FROM mapping m JOIN `default.events` e ON e.magnet_uuid=m.identifier
 WHERE e._timestamp<TIMESTAMP('{data['cutoff_exclusive_utc']}') AND e.parsed_ua_bot IS NOT TRUE
 AND e.event_type IN ('open_tour','button_click')
), keyed AS (
 SELECT *,COALESCE(NULLIF(eventn_ctx_event_id,''),TO_JSON_STRING(STRUCT(_timestamp,event_type,visit_uuid,destination,origin))) AS event_key
 FROM raw
), events AS (
 SELECT *,CASE WHEN STARTS_WITH(destination,'[') THEN ARRAY_TO_STRING(JSON_VALUE_ARRAY(destination),'.') ELSE destination END AS route
 FROM keyed QUALIFY ROW_NUMBER() OVER(PARTITION BY uuid,event_key ORDER BY _timestamp)=1
) SELECT uuid,COUNTIF(event_type='open_tour') AS initial_screen_views,
 COUNTIF(event_type='button_click' AND REGEXP_CONTAINS(route,r'^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$')) AS navigation_screen_views,
 COUNTIF(event_type='button_click' AND NOT COALESCE(REGEXP_CONTAINS(route,r'^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$'),FALSE)) AS excluded_non_screen_clicks
 FROM events GROUP BY uuid ORDER BY uuid"""
results = ghp.bq(query)
scopes = {}
for uid, initial, navigation, excluded in results:
    scopes[uid] = {'initial_screen_views':initial,'navigation_screen_views':navigation,'screen_views':initial+navigation,'excluded_non_screen_clicks':excluded}
assert len(scopes) == len(data['properties'])
# Any unexpected destination format must be reviewed rather than silently discarded.
assert all(v['excluded_non_screen_clicks'] == 0 for v in scopes.values()), 'Review unclassified click destinations before publishing'
data['screen_views'] = {
    'retrieved_at':datetime.now(timezone.utc).isoformat(),
    'definition':'Derived recorded screen views: one initial screen view per retained open_tour event plus one view for each recorded button_click with a category.screen destination. Includes repeat opens/selections and all screen types; not unique people, distinct screens or completed video plays. Form/iframe events are not added separately to avoid double counting the same navigation. No visit-ID requirement because this metric counts events, not sessions.',
    'filters':'Canonical UUID, alias and @alias combined, before the report cutoff; flagged bots excluded. Duplicate eventn_ctx_event_id values are counted once per property; if missing, exact timestamp/type/visit/origin/destination duplicates are collapsed.',
    'coverage':'Based on retained events and inferred screen transitions, not playback confirmation. Historical navigation tracking varies by property and period, notably sparse click records for The Lorenzo in 2025–2026. Totals reflect recorded views, not every untracked screen impression.',
    'scopes':scopes,
    'totals':{key:sum(v[key] for v in scopes.values()) for key in ['initial_screen_views','navigation_screen_views','screen_views','excluded_non_screen_clicks']},
    'query':query,
}
source.write_text(json.dumps(data,indent=2)+'\n')
for p in data['properties']:
    print(json.dumps({'property':p['name'],**scopes[p['uuid']]}))
print('TOTALS',json.dumps(data['screen_views']['totals']))

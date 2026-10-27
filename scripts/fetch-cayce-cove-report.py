#!/usr/bin/env python3
"""Read aggregate Cayce Cove performance. Never modify source databases."""
import concurrent.futures
import importlib.util
import json
import re
import urllib.parse
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ghp', ROOT / 'scripts/fetch-ghp-report.py')
ghp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ghp)
config = json.loads((ROOT / 'data/reports/cayce-cove-report-config.json').read_text())
props = config['properties']
cutoff = config['cutoff_exclusive_utc']
e = ghp.env()
base = (e.get('NEXT_PUBLIC_SUPABASE_URL') or e.get('SUPABASE_URL')).rstrip('/')
key = e.get('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') or e.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') or e.get('SUPABASE_ANON_KEY') or e.get('SUPABASE_KEY')
headers = {'apikey':key,'Authorization':'Bearer '+key}


def rest(table, params):
    rows = []
    for start in range(0,100000,1000):
        page,_ = ghp.request(base+'/rest/v1/'+table+'?'+urllib.parse.urlencode(params),headers={**headers,'Range':f'{start}-{start+999}'})
        rows.extend(page)
        if len(page)<1000:return rows
    raise RuntimeError('Pagination cap exceeded')


def fetch_property(p):
    community = rest('Community',{'select':'id,name,enabled,hidden,launchDate','id':'eq.'+str(p['community_id'])})[0]
    assert community['enabled'] and not community['hidden']
    magnet = rest('Magnet',{'select':'uuid,community_id,alias,magnet_details','uuid':'eq.'+p['uuid']})[0]
    assert magnet['community_id']==p['community_id'] and magnet['alias']==p['alias']
    template = magnet['magnet_details']['template']
    screens = {}
    intros = [v.get('video','') for v in template.get('categories',{}).get('intro',{}).get('screens',{}).values()]
    assert intros and not any('Bellamy20Carollton' in v for v in intros), 'Sample intro found in live roster'
    for cat in ['amenities','floor_plans']:
        for slug,screen in template.get('categories',{}).get(cat,{}).get('screens',{}).items():
            title = (screen.get('title') or slug).strip()
            if slug in ['main','main_page'] or re.search(r'intro|main|form_screen|broll',slug,re.I) or re.search(r'\b(intro|main)\b',title,re.I):continue
            iframe = screen.get('iframe') or {}
            if not screen.get('video') and not iframe.get('enabled'):continue
            screens[cat+'.'+slug]={'title':title,'category':cat,'format':'3D' if iframe.get('enabled') else 'Video'}
    # Prospect identifiers and message contents are only processed in memory, never saved or printed.
    leads = rest('Lead',{'select':'id,time,details->metadata','magnet_uuid':'eq.'+p['uuid'],'time':'lt.'+cutoff,'order':'id.asc'})
    counts = Counter(leads=len(leads),scheduled_leads=0,question_leads=0,overlapping_leads=0)
    outside = 0 if p['weekly_intervals'] is not None else None
    for row in leads:
        if outside is not None:
            timestamp = re.sub(r'\.(\d+)',lambda m:'.'+m[1].ljust(6,'0')[:6],row['time'].replace('Z','+00:00'))
            local = datetime.fromisoformat(timestamp).astimezone(ZoneInfo(p['timezone']))
            minutes = local.hour*60+local.minute
            outside += not any(a<=minutes<b for a,b in p['weekly_intervals'][local.weekday()])
        metadata = row.get('metadata') or []
        if isinstance(metadata,dict):metadata=[metadata]
        if not isinstance(metadata,list):metadata=[]
        entries=[v for v in metadata if isinstance(v,dict)]
        scheduled=any(v.get('tour_time_start') and (v.get('tour_date') or v.get('appointment_date')) for v in entries)
        question=any(str(v.get('lead_type','')).lower()=='question' and (v.get('message') or v.get('reason') or v.get('notes')) for v in entries)
        counts['scheduled_leads']+=bool(scheduled);counts['question_leads']+=bool(question);counts['overlapping_leads']+=bool(scheduled and question)
    return {**p,**counts,'outside_hours_leads':outside,'screen_catalog':screens,'launch_date':community.get('launchDate'),'live_verified':True}


mapping = ','.join(f"STRUCT('{p['uuid']}' AS uuid,'{identifier}' AS identifier,'{p['timezone']}' AS timezone)" for p in props for identifier in [p['uuid'],p['alias'],'@'+p['alias']])
prefix=f"""WITH mapping AS (SELECT * FROM UNNEST([{mapping}])), e AS (
 SELECT m.uuid,e.*,DATETIME(e._timestamp,m.timezone) AS local_time
 FROM mapping m JOIN `default.events` e ON e.magnet_uuid=m.identifier
 WHERE _timestamp<TIMESTAMP('{cutoff}')
) """
hours_cases=[]
for p in props:
    if p['weekly_intervals'] is None:continue
    conditions=[]
    for day,intervals in enumerate(p['weekly_intervals']):
        for start,end in intervals:
            conditions.append(f"(EXTRACT(DAYOFWEEK FROM local_time)={(day+1)%7+1} AND (EXTRACT(HOUR FROM local_time)*60+EXTRACT(MINUTE FROM local_time))>={start} AND (EXTRACT(HOUR FROM local_time)*60+EXTRACT(MINUTE FROM local_time))<{end})")
    hours_cases.append(f"WHEN uuid='{p['uuid']}' THEN NOT ({' OR '.join(conditions)})")
outside_case='CASE '+' '.join(hours_cases)+' ELSE NULL END'
queries={'counts':prefix+f""", classified AS(SELECT *,{outside_case} AS outside_hours FROM e)
 SELECT uuid,COUNTIF(event_type='open_tour'),COUNTIF(event_type='open_tour' AND outside_hours),
 MIN(IF(event_type='open_tour',_timestamp,NULL)),MAX(IF(event_type='open_tour',_timestamp,NULL))
 FROM classified GROUP BY uuid""",
'content':prefix+"SELECT uuid,COALESCE(NULLIF(details_to,''),NULLIF(`to`,''),NULLIF(details_route,'')) AS route,COUNT(*) FROM e WHERE event_type='button_click' AND parsed_ua_bot IS NOT TRUE GROUP BY 1,2"}
geo_prefix=prefix+""", locations AS(SELECT uuid AS scope,event_type,parsed_ua_bot,
 NULLIF(TRIM(location_country_name),'') AS country,NULLIF(TRIM(location_region),'') AS region,NULLIF(TRIM(location_city),'') AS city FROM e),
 scoped AS(SELECT * FROM locations UNION ALL SELECT 'portfolio',event_type,parsed_ua_bot,country,region,city FROM locations) """
queries['reach']=geo_prefix+"""SELECT scope,COUNT(DISTINCT country),COUNT(DISTINCT TO_JSON_STRING(STRUCT(country,region))),COUNT(DISTINCT TO_JSON_STRING(STRUCT(country,region,city)))
 FROM scoped WHERE country IS NOT NULL AND region IS NOT NULL AND city IS NOT NULL GROUP BY scope"""
for dimension,fields,known in [('cities','city,region,country','city IS NOT NULL AND region IS NOT NULL AND country IS NOT NULL'),('states','region,country','region IS NOT NULL AND country IS NOT NULL'),('countries','country','country IS NOT NULL')]:
    excluded=" AND LOWER(country) NOT IN ('pakistan','philippines')"+(" AND LOWER(city)!='sterling heights'" if dimension=='cities' else '')
    queries[dimension]=geo_prefix+f""", ranked AS(SELECT scope,{fields},COUNT(*) AS tours FROM scoped WHERE event_type='open_tour' AND parsed_ua_bot IS NOT TRUE AND {known}{excluded} GROUP BY scope,{fields})
 SELECT * FROM ranked QUALIFY ROW_NUMBER() OVER(PARTITION BY scope ORDER BY tours DESC,{fields})<=5 ORDER BY scope,tours DESC,{fields}"""
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    pf=[pool.submit(fetch_property,p) for p in props]
    qf={k:pool.submit(ghp.bq,v) for k,v in queries.items()}
    properties=[f.result() for f in pf]
    results={k:f.result() for k,f in qf.items()}
counts={row[0]:row[1:] for row in results['counts']}
for p in properties:
    p.update(dict(zip(['tours','outside_hours_tours','first_tour_at','latest_tour_at'],counts.get(p['uuid'],[0,0,None,None]))))
    if p['weekly_intervals'] is None:p['outside_hours_tours']=None
    clicks=Counter()
    for uid,route,count in results['content']:
        if uid!=p['uuid'] or not route:continue
        try:
            value=json.loads(route);route='.'.join(value) if isinstance(value,list) else value
        except (ValueError,TypeError):pass
        if isinstance(route,str) and route in p['screen_catalog']:clicks[route]+=count
    p['top_content']={}
    for cat,limit in [('amenities',3),('floor_plans',1)]:
        ranked=[{'route':route,**p['screen_catalog'][route],'selections':count} for route,count in clicks.items() if p['screen_catalog'][route]['category']==cat]
        p['top_content'][cat]=sorted(ranked,key=lambda r:(-r['selections'],r['title'],r['route']))[:limit]
    assert p['scheduled_leads']<=p['leads'] and p['question_leads']<=p['leads']
scopes={'portfolio':{'name':'Cayce Cove portfolio'}}
scopes.update({p['uuid']:{'name':p['name']} for p in properties})
for uid,countries,regions,cities in results['reach']:scopes[uid]['reach']={'countries':countries,'regions':regions,'cities':cities}
for uid in scopes:
    scopes[uid].setdefault('reach',{'countries':0,'regions':0,'cities':0})
    for dim,fields in [('cities',['city','region','country','tours']),('states',['region','country','tours']),('countries',['country','tours'])]:
        scopes[uid][dim]=[dict(zip(fields,row[1:])) for row in results[dim] if row[0]==uid]
totals={key:sum(p[key] or 0 for p in properties) for key in ['tours','leads','outside_hours_tours','outside_hours_leads','scheduled_leads','question_leads','overlapping_leads']}
totals['hours_covered_tours']=sum(p['tours'] for p in properties if p['weekly_intervals'] is not None)
totals['hours_covered_leads']=sum(p['leads'] for p in properties if p['weekly_intervals'] is not None)
totals['hours_covered_properties']=sum(p['weekly_intervals'] is not None for p in properties)
out={'title':config['title'],'retrieved_at':datetime.now(timezone.utc).isoformat(),'cutoff_exclusive_utc':cutoff,'scope_definition':config['scope_definition'],'excluded':config['excluded'],'properties':properties,'totals':totals,'geography':{'scopes':scopes},'queries':queries,'methodology':{
 'tours':'Counts of retained open_tour events before cutoff, mapped by UUID, alias and @alias. Repeat opens count. No three-click threshold is applied.',
 'leads':'Saved lead records on canonical tours created before cutoff; no contact details included in this snapshot.',
 'hours':'Published current property website hours, applied retrospectively in America/New_York with DST. Opening included, closing excluded. Holidays and past hours changes not modeled. Office hours use indexed official property pages; main website unavailable at retrieval, so current hours were not independently confirmed.',
 'next_steps':'Unique lead rows with metadata containing appointment date and start time, or explicit Question type with message/reason/notes. Histories deduplicated within each lead. Subsets of captured leads; categories may overlap. Metadata reflects retrieval-time state for leads created before cutoff. Scheduling indicates requests/bookings, not attendance.',
 'geography':'Distinct known locations in all tracked activity with complete country/region/city fields; portfolio locations deduplicated. Top five locations use open_tour events excluding flagged bots and unknown fields, matching dashboard exclusions of Pakistan, Philippines and city Sterling Heights. Provinces/states includes equivalent international regions.',
 'content':'Top three amenities and top one floor plan by button_click route counts (details_to, to, then details_route fallback), excluding flagged bots, overview, montage and form screens. Titles and media type use current configuration and may differ historically. Repeat selections count; no watch-duration/completion inference.'}}
path=ROOT/'data/reports/cayce-cove-2026-10-28.json';path.write_text(json.dumps(out,indent=2)+'\n')
for p in properties:print(json.dumps({k:p[k] for k in ['name','tours','leads','outside_hours_tours','scheduled_leads','question_leads','top_content']}))
print('TOTALS',json.dumps(totals));print('REACH',json.dumps(scopes['portfolio']['reach']))

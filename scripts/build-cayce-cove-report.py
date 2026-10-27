#!/usr/bin/env python3
"""Render Cayce Cove performance from a saved aggregate-only snapshot."""
import base64
import json
from html import escape as esc
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'data/reports/cayce-cove-2026-10-28.json').read_text())
p=data['properties'][0]
t=data['totals']
g=data['geography']['scopes'][p['uuid']]
def n(x):return f'{x:,}'
def pct(a,b):return f'{a/b*100:.1f}%' if b else '—'
def image(path,mime):return 'data:'+mime+';base64,'+base64.b64encode((ROOT/path).read_bytes()).decode()
def stat(value,label):return f'<div><div class="n">{value}</div><div class="l">{label}</div></div>'
def link():return f'<a href="{esc(p["tour_url"])}" target="_blank" rel="noopener">Cayce Cove</a>'
CSS="""
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&family=Inter:wght@400;500;600;700&display=swap');
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box}
html{scroll-behavior:auto}
body{margin:0;background:#e1e2e3;color:#242424;font:14px Inter,Arial,sans-serif}
a{color:inherit;text-underline-offset:3px}a:hover{color:#a32c30}a:focus-visible{outline:2px solid #a32c30;outline-offset:4px}
.page{width:8.5in;min-height:11in;margin:28px auto;background:#fff;padding:.55in .85in;display:flex;flex-direction:column}
.cover{justify-content:space-between;padding:.92in .9in .82in}
.eyebrow,.k{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#777}
.wordmark{font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase}
.brandmarks{display:flex;align-items:center;gap:18px}.lm-logo{width:128px;height:auto}.brand-divider{color:#c4c5c7;font-size:17px}
.ghp-logo{width:84px;height:auto;display:block}
.cover-top{display:flex;align-items:center;justify-content:space-between;gap:24px}
.display{font-family:'Cal Sans',Inter,Arial,sans-serif;color:#141414;line-height:1.02}
.cover h1{font-size:58px;margin:18px 0 18px;letter-spacing:-.035em}
.cover p{max-width:520px;color:#6b7076;line-height:1.7}
.property-list{font-size:12px!important;color:#242424!important}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:26px 30px;border-top:1px solid #e1e2e3;margin-top:30px;padding-top:24px}
.n{font:34px 'Cal Sans',Inter,Arial,sans-serif;letter-spacing:-.025em}.l{margin-top:7px;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:#777;line-height:1.6}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:18px;background:#f4f4f4;padding:20px}.v{margin-top:8px;font-size:11px;line-height:1.6}
.report-index{display:grid;gap:9px;margin:26px 0;font-size:11px}.report-index .k{margin-bottom:3px}.report-index a{width:fit-content}
.runhead{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #e1e2e3;padding-bottom:12px;margin-bottom:24px}
.title{font:30px 'Cal Sans',Inter,Arial,sans-serif;letter-spacing:-.025em;margin:12px 0 10px;color:#141414}
.subtitle{font:22px 'Cal Sans',Inter,Arial,sans-serif;margin:24px 0 10px;color:#141414}
.note,.foot{color:#6b7076;font-size:10px;line-height:1.65}.note{margin:0 0 18px}.foot{margin:15px 0 0}
.table-wrap{width:100%;overflow-x:auto}
table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:11px}
caption{text-align:left;font-size:11px;font-weight:600;margin-bottom:12px}
thead th{padding:12px 5px;border-bottom:1px solid #ddd;text-align:right;color:#777;font-size:8px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;line-height:1.6}
tbody td,tbody th,tfoot td,tfoot th{padding:11px 5px;border-bottom:1px solid #e1e2e3;text-align:right;font-weight:400;color:#6b7076;vertical-align:top;font-variant-numeric:tabular-nums}
th:first-child{text-align:left;width:38%}tbody th{font-weight:600;color:#242424}tfoot th,tfoot td{font-weight:600;color:#242424;border-top:2px solid #242424;padding-top:14px}
.raw-url{display:block;margin-top:8px;font-size:8px;font-weight:400;overflow-wrap:anywhere;line-height:1.5;color:#6b7076}
.office-hours,.launch-date{font-weight:400;line-height:1.6}
.cell-sub{display:block;margin-top:5px;font-size:9px;color:#777}.strong{font-weight:600;color:#141414}
.callout{background:#f4f4f4;padding:18px;margin-top:20px}.callout p{margin:8px 0 0;font-size:11px;color:#6b7076;line-height:1.7}
.callout h3{font-size:12px;font-weight:600;margin:0;line-height:1.5}
.method{margin:24px 0 0;display:grid;gap:12px}.method p{margin:0;font-size:10px;line-height:1.7;color:#6b7076}.method strong{color:#242424;font-weight:600}
.pagefoot{margin-top:auto;padding-top:24px;display:flex;justify-content:space-between;gap:20px;font-size:9px;color:#777;line-height:1.6}
.cover .pagefoot{margin-top:0;padding-top:15px}
.share{margin:16px 0}.share-label{display:flex;justify-content:space-between;gap:12px;font-size:11px;line-height:1.6}.share-label span:last-child{font-size:10px;color:#6b7076}.share-label b{font-weight:600;color:#242424}
.track{height:7px;background:#eee;margin-top:10px}.track div{height:100%;background:#242424}
.dates th:first-child{width:38%}.dates td,.dates thead th{text-align:left}
.timing-hero{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:5px 0 26px;padding:24px 0;border-top:1px solid #ddd;border-bottom:1px solid #ddd}
.hours-table th:first-child{width:32%}.hours-table th:nth-child(2){width:26%}.hours-table th:nth-child(3){width:18%}.hours-table th:nth-child(4){width:24%}
.reach-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f4f4f4;padding:17px;margin:12px 0 12px;text-align:center}
.reach-cards strong{display:block;font:26px 'Cal Sans',Inter,sans-serif}.reach-cards span{display:block;margin-top:6px;font-size:10px;color:#6b7076}
.geo-controls{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:4px 0 0;font-size:11px}.geo-controls select{font:inherit;background:#fff;border:1px solid #ccc;padding:8px 10px;max-width:70%;border-radius:3px}
.geo-scope-name{font-size:12px;font-weight:600;margin:12px 0 0}.geo-block h3{font:18px 'Cal Sans',Inter,sans-serif;margin:12px 0 3px}
.geo-table thead th{padding:5px;font-size:7px}.geo-table tbody th,.geo-table tbody td{padding:4px 5px;font-size:10px;line-height:1.4}
.geo-table th:first-child{width:38%}.geo-table td:nth-child(2),.geo-table th:nth-child(2){text-align:left}.geo-table td:last-child,.geo-table th:last-child{width:16%;text-align:right}.geo-table.countries th:first-child{width:84%}
.content-table th:first-child,.content-table td:first-child{width:8%;text-align:left}.content-table th:nth-child(2){width:52%;text-align:left}.content-table th:nth-child(3){width:16%}.content-table th:last-child{width:24%}.content-table tbody td,.content-table tbody th{padding:10px 5px}.outcomes-table th:first-child{width:34%}
#next-steps .timing-hero{padding:14px 0;margin-bottom:14px}#next-steps tbody td,#next-steps tbody th,#next-steps tfoot td,#next-steps tfoot th{padding-top:7px;padding-bottom:7px}#next-steps .method{margin-top:16px;gap:8px}#next-steps .subtitle{margin-top:18px}
.geo-panel[hidden]{display:none}.geo-note{font-size:9px;line-height:1.55;margin-top:12px;color:#6b7076}
@media screen and (max-width:900px){.page{width:100%;min-height:100vh;margin:0;padding:32px 24px}.cover{gap:38px}.cover h1{font-size:48px}.cover-top{flex-wrap:wrap}.pagefoot{padding-top:32px}}
@media screen and (max-width:480px){.page{padding:26px 18px}.cover h1{font-size:44px}.cover-top>.eyebrow{font-size:8px}.n{font-size:30px}.runhead{flex-wrap:wrap}table{font-size:10px}thead th{font-size:7px;letter-spacing:.04em;padding-left:3px;padding-right:3px}tbody td,tbody th,tfoot td,tfoot th{padding-left:3px;padding-right:3px}.raw-url{font-size:7px}.share-label{display:block}.share-label span{display:block}.meta{padding:16px;gap:12px}.pagefoot{font-size:8px}.title{font-size:28px}}
@media print{html{scroll-behavior:auto}body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{margin:0;height:11in;min-height:0;break-after:page}.page:last-child{break-after:auto}.table-wrap{overflow:visible}a{text-decoration:none}.report-index a{text-decoration:underline}tr,.callout{break-inside:avoid}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}

.cayce-mark{display:block;position:relative;width:112px;height:112px;overflow:hidden}.cayce-mark img{position:absolute;width:308px;height:auto;max-width:none;left:-24px;top:-25px}
.cover{padding-top:.6in}.cover h1{font-size:56px}.cover .pagefoot{padding-top:18px}.outcomes-table th:first-child{width:64%}.outcomes-table td{text-align:right}
.hours-table th:first-child{width:42%}.hours-table th:nth-child(2){width:21%}.hours-table th:nth-child(3){width:16%}.hours-table th:nth-child(4){width:21%}
.content-table th:first-child{width:9%}.content-table th:nth-child(2){width:51%}.content-table th:nth-child(3){width:16%}.content-table th:nth-child(4){width:24%}
.lease-outcome{margin-top:26px;padding:18px;background:#f4f4f4}.source-link{font-size:9px;color:#777}#results .timing-hero{padding:14px 0;margin-bottom:18px}#results .method{gap:8px;margin-top:16px}.reach-cards{margin:18px 0}.geo-block h3{margin-top:14px}.geo-table tbody th,.geo-table tbody td{padding-top:5px;padding-bottom:5px}
@media screen and (max-width:480px){.cover h1{font-size:44px}.cayce-mark{transform:scale(.85);transform-origin:center}.hours-table th:first-child{width:39%}.brandmarks{gap:10px}}
"""
pages=[]
def page(id,label,title,body):
 pages.append((id,f'<div class="runhead"><span class="wordmark">LeaseMagnets · Cayce Cove</span><a class="eyebrow" href="#overview">Report index</a></div><div class="eyebrow">{label}</div><h2 class="title">{title}</h2>'+body))
cover=f"""<div class="cover-top"><div class="brandmarks"><img class="lm-logo" alt="LeaseMagnets" src="{image(Path('public/logos/lm-logo-tyg.svg'),'image/svg+xml')}"><span class="brand-divider" aria-hidden="true">×</span><span class="cayce-mark"><img alt="Cayce Cove" src="{image(Path('public/logos/cayce-cove.jpg'),'image/jpeg')}"></span></div><span class="eyebrow">Property performance</span></div>
<div><div class="eyebrow">Cayce Cove · Cayce, South Carolina</div><h1 class="display">Tour<br>performance.</h1><p>All-time virtual tour engagement, captured leads, and activity outside office hours for Cayce Cove.</p><div class="stats">{stat(n(t['tours']),'All-time tour opens')}{stat(n(t['leads']),'All-time captured leads')}{stat(n(g['reach']['cities']),'Cities reached')}{stat(pct(t['outside_hours_tours'],t['tours']),'Of tours outside office hours*')}</div><p class="foot">*Based on the published schedule detailed in the <a href="#outside-hours">office-hours analysis</a>.</p></div>
<div><nav class="report-index" aria-label="Report index"><span class="k">Report index</span><a href="#results">01 / Tour results &amp; lease outcomes</a><a href="#viewers-reached">02 / All-time geographic reach</a><a href="#outside-hours">03 / Outside business hours</a><a href="#most-explored">04 / Most explored amenities &amp; floor plan</a></nav><div class="meta"><div><div class="k">Coverage</div><div class="v"><b>Cayce Cove</b> · All recorded history</div></div><div><div class="k">Reporting cutoff</div><div class="v"><b>October 27, 2026</b> · 6:00 PM UTC</div></div></div></div>"""
pages.append(('overview',cover))
page('results','01 / All-time tour results','From discovery to action',f"""<p class="note">Tour engagement and saved lead outcomes for Cayce Cove. Open the tour using the property link below.</p><table><caption>All-time tour performance</caption><thead><tr><th scope="col">Community</th><th scope="col">Tour opens</th><th scope="col">Captured leads</th></tr></thead><tbody><tr><th scope="row">{link()}</th><td>{n(t['tours'])}</td><td>{n(t['leads'])}</td></tr></tbody></table>
<div class="lease-outcome"><div class="n">{n(t['leased_leads'])}</div><div class="l">Captured leads marked leased</div></div><p class="foot">The 99 leased records are a subset of the {n(t['leads'])} captured leads. This reflects saved lease status at retrieval; signed lease documents and signing dates were not independently verified.</p>
<div class="method"><p><strong>Tour opens.</strong> Counts of retained tour-opening events, including repeat opens. These are not unique people or completed walkthroughs, and no three-click threshold is applied.</p><p><strong>Captured leads.</strong> Saved lead records created before the reporting cutoff. Outcomes use metadata as retrieved, which may have been updated after lead creation. No prospect contact information is included.</p><p><strong>Reporting period.</strong> All available records before October 27, 2026 at 18:00 UTC. Retrieved October 28, 2026. This published snapshot does not refresh automatically.</p></div>""")
geo=''
for dim,title in [('cities','Top 5 cities'),('states','Top 5 states / regions'),('countries','Top 5 countries')]:
 rows=[]
 for r in g[dim][:5]:
  label=r['city'] if dim=='cities' else r['region'] if dim=='states' else r['country']
  context=r['region']+', '+r['country'] if dim=='cities' else r['country'] if dim=='states' else None
  rows.append(f'<tr><th scope="row">{esc(label)}</th>'+ (f'<td>{esc(context)}</td>' if context else '')+f'<td>{n(r["tours"])}</td></tr>')
 middle='<th scope="col">Region / country</th>' if dim=='cities' else '<th scope="col">Country</th>' if dim=='states' else ''
 geo+=f'<div class="geo-block"><h3>{title}</h3><table class="geo-table {dim}"><thead><tr><th scope="col">Name</th>{middle}<th scope="col">Tour opens</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
cards=''.join(f'<div><strong>{n(g["reach"][k])}</strong><span>{label}</span></div>' for k,label in [('countries','Countries'),('regions','States / regions'),('cities','Cities')])
page('viewers-reached','02 / All-time geographic reach','Viewers reached',f'<p class="note">The geographic reach of all-time tracked activity for Cayce Cove. Rankings show the top five locations by recorded tour opens.</p><div class="reach-cards">{cards}</div>{geo}<p class="geo-note">Reach counts distinct locations represented in tracked activity with complete country, region, and city fields, not people. Rankings exclude flagged bots and unknown locations, following dashboard exclusions of Pakistan, Philippines, and (for cities) Sterling Heights. Location is inferred from event geolocation.</p>')
hours=esc(p['hours']).replace('; ','<br>')
page('outside-hours','03 / All-time tour timing','Outside business hours',f"""<p class="note">Tour and lead activity beyond the published office schedule, evaluated in Cayce’s local Eastern Time, including daylight saving time.</p><div class="timing-hero">{stat(pct(t['outside_hours_tours'],t['tours']),'Of tours outside office hours')}{stat(pct(t['outside_hours_leads'],t['leads']),'Of leads captured outside office hours')}</div><table class="hours-table"><thead><tr><th scope="col">Community / hours used</th><th scope="col">Outside-hours opens</th><th scope="col">Tour share</th><th scope="col">Outside-hours leads</th></tr></thead><tbody><tr><th scope="row">{link()}<span class="cell-sub office-hours"><a href="{esc(p['hours_source_url'])}" target="_blank" rel="noopener">{hours}</a></span></th><td>{n(t['outside_hours_tours'])}<span class="cell-sub">of {n(t['tours'])} opens</span></td><td class="strong">{pct(t['outside_hours_tours'],t['tours'])}</td><td>{n(t['outside_hours_leads'])}<span class="cell-sub">of {n(t['leads'])} leads</span></td></tr></tbody></table>
<div class="callout"><h3>Office-hour basis</h3><p>The schedule above comes from indexed official Cayce Cove property pages accessed October 28, 2026. The main property website was unavailable during retrieval, so the current schedule could not be independently confirmed.</p></div><p class="foot">The published schedule is applied retrospectively to all retained events; holidays and historical schedule changes are not modeled. Opening time is included and closing time is excluded. Lead timing uses saved lead creation timestamps.</p>""")
def ranking(rows,title):
 body=''.join(f'<tr><td>{i}</td><th scope="row">{esc(r["title"].strip())}</th><td>{esc(r["format"])}</td><td>{n(r["selections"])}</td></tr>' for i,r in enumerate(rows,1))
 return f'<h3 class="subtitle">{title}</h3><table class="content-table"><thead><tr><th scope="col">Rank</th><th scope="col">Tour screen</th><th scope="col">Format</th><th scope="col">Selections</th></tr></thead><tbody>{body}</tbody></table>'
page('most-explored','04 / Most explored tour content','What visitors explore',f'<p class="note">The top three amenities and top floor-plan screen by all-time recorded selections. <a href="{esc(p["tour_url"])}" target="_blank" rel="noopener">Open Cayce Cove’s tour</a></p>'+ranking(p['top_content']['amenities'],'Top 3 amenities')+ranking(p['top_content']['floor_plans'],'Top floor plan')+'<p class="foot">A selection is a recorded navigation to a tour screen; repeat selections count. Rankings exclude flagged bots, overview and montage screens, and forms. These figures describe selections, not watch duration or completed video views. Video and 3D screens are identified separately.</p><p class="foot">Names and media types reflect the current tour configuration; a screen’s content may have changed over time.</p><p class="foot source-link">Cayce Cove brand artwork: <a href="https://www.kelleyadv.com/portfolio2/2022/2/18/pep-cayce-cove-rebranding" target="_blank" rel="noopener">Kelley &amp; Associates’ Cayce Cove branding portfolio</a>.</p>')
sections=[]
for i,(id,body) in enumerate(pages,1):
 sections.append(f'<section id="{id}" class="page {"cover" if id=="overview" else ""}">{body}<footer class="pagefoot"><span>Cayce Cove tour performance · All time</span><span>October 27, 2026 · 18:00 UTC · {i:02d} / {len(pages):02d}</span></footer></section>')
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cayce Cove Tour Performance Report</title><meta name="description" content="All-time Cayce Cove virtual tour performance: tour opens, leads, geographic reach, outside-office-hours activity and popular amenities and floor plans."><style>'+CSS+'</style></head><body><main>'+''.join(sections)+'</main></body></html>'
(ROOT/'public/cayce-cove-performance-report.html').write_text(html)
print(f'Built {len(pages)} pages for Cayce Cove.')

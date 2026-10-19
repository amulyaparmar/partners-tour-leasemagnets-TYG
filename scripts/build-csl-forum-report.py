#!/usr/bin/env python3
"""Build the CSL / Forum report from its aggregate, non-personal snapshot."""
import base64
import json
from html import escape as esc
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'data/reports/csl-forum-portfolio-2026-10-19.json').read_text())
properties = data['properties']
totals = data['totals']
scopes = data['geography']['scopes']
assert len(properties) == 13
assert sum(p['tours'] for p in properties) == totals['tours']
assert sum(p['leads'] for p in properties) == totals['leads']
assert totals['scheduled_leads'] <= totals['leads']

def n(v): return f'{v:,}' if v is not None else '—'
def pct(a,b): return f'{a/b*100:.1f}%' if a is not None and b else '—'
def prop(p): return f'<a href="{esc(p["tour_url"])}" target="_blank" rel="noopener">{esc(p["name"])}</a>'
def totalrow(label, keys): return '<tr><th scope="row">'+label+'</th>'+''.join('<td>'+n(totals[k])+'</td>' for k in keys)+'</tr>'
def img(path, mime): return 'data:'+mime+';base64,'+base64.b64encode((ROOT/path).read_bytes()).decode()

CSS = """
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
"""
CSS += """
.csl-logo{width:150px;height:auto;display:block}.cover h1{font-size:56px}
.ledger-table th:first-child,.outcomes-table th:first-child{width:48%}
.ledger-table tbody th,.ledger-table tbody td{padding:10px 5px}
.hours-table th:first-child{width:42%}.hours-table th:nth-child(2){width:21%}.hours-table th:nth-child(3){width:14%}.hours-table th:nth-child(4){width:23%}
.hours-table tbody td,.hours-table tbody th{padding:10px 5px}.hours-table .office-hours{font-size:9px}
.content-block{margin-top:22px}.content-block h3{font:19px 'Cal Sans',Inter,sans-serif;margin:0 0 8px}
.ranking th:first-child{width:23%;font-weight:500;color:#777}.ranking th:nth-child(2){width:46%;text-align:left}.ranking td:nth-child(3),.ranking thead th:nth-child(3){width:14%;text-align:left}.ranking td:last-child{width:17%;text-align:right}
.ranking tbody td,.ranking tbody th{padding:8px 5px;font-size:10px}.ranking thead th{padding:6px 5px}
#next-steps .outcomes-table tbody td,#next-steps .outcomes-table tbody th{padding:10px 5px}
@media screen and (max-width:480px){.csl-logo{width:120px}.lm-logo{width:110px}.cover h1{font-size:44px}.hours-table .office-hours{font-size:8px}.content-block h3{font-size:18px}.ranking tbody td,.ranking tbody th{font-size:9px}}
"""
pages = []
def page(id, label, title, content):
    pages.append((id, f'<div class="runhead"><span class="wordmark">LeaseMagnets · CSL / Forum</span><a href="#overview" class="eyebrow">Report index</a></div><div class="eyebrow">{label}</div><h2 class="title">{title}</h2>'+content))

outside_pct = pct(totals['outside_hours_tours'],totals['hours_covered_tours'])
lead_pct = pct(totals['outside_hours_leads'],totals['hours_covered_leads'])
cover = f"""
<div class="cover-top"><div class="brandmarks"><img class="lm-logo" alt="LeaseMagnets" src="{img(Path('public/logos/lm-logo-tyg.svg'),'image/svg+xml')}"><span class="brand-divider" aria-hidden="true">×</span><a href="https://www.canadianstudentliving.com/"><img class="csl-logo" alt="Canadian Student Living" src="{img(Path('public/logos/csl-logo.png'),'image/png')}"></a></div><span class="eyebrow">Portfolio intelligence</span></div>
<div><div class="eyebrow">CSL / Forum · Canadian Student Living &amp; ALMA</div><h1 class="display">Portfolio<br>performance.</h1><p>All-time virtual tour engagement, captured leads, and activity outside office hours across 13 live property tours in Ontario and Quebec.</p>
<div class="stats"><div><div class="n">{n(totals['tours'])}</div><div class="l">All-time tour opens</div></div><div><div class="n">{n(totals['leads'])}</div><div class="l">All-time captured leads</div></div><div><div class="n">{n(scopes['portfolio']['reach']['cities'])}</div><div class="l">Cities reached</div></div><div><div class="n">{outside_pct}</div><div class="l">Of tours outside office hours</div><span class="cell-sub">12 properties with published hours</span></div></div></div>
<div><nav class="report-index" aria-label="Report index"><span class="k">Report index</span><a href="#ledger">01 / Portfolio ledger</a><a href="#viewers-reached">02 / All-time geographic reach</a><a href="#outside-hours">03 / Outside business hours</a><a href="#next-steps">04 / From discovery to action</a><a href="#most-explored">05 / Most explored amenities &amp; floor plans</a></nav><div class="meta"><div><div class="k">Coverage</div><div class="v"><b>13 live tours</b> · All recorded history</div></div><div><div class="k">Reporting cutoff</div><div class="v"><b>October 18, 2026</b> · End of day UTC</div></div></div></div>
"""
pages.append(('overview',cover))
ledger=''.join(f'<tr><th scope="row">{prop(p)}</th><td>{n(p["tours"])}</td><td>{n(p["leads"])}</td></tr>' for p in properties)
page('ledger','01 / Community-level results','The portfolio ledger', f"""<p class="note">All-time results for each live CSL / Forum tour, including ALMA communities. Property names open the live tours.</p><table class="ledger-table"><caption>All-time tour opens and captured leads</caption><thead><tr><th scope="col">Community</th><th scope="col">Tour opens</th><th scope="col">Captured leads</th></tr></thead><tbody>{ledger}</tbody><tfoot>{totalrow('Portfolio total',['tours','leads'])}</tfoot></table>
<p class="foot">Tour opens count retained opening events, including repeat opens; they are not unique visitors or completed walkthroughs. Leads count saved lead records. Both use all available history before October 19, 2026 at 00:00 UTC.</p><p class="foot">Scope checked October 19, 2026. Four enabled entries still use sample footage and are excluded: 417 Nelson, ALMA @ South End, ALMA Gastown Vancouver, and 399 Stan Bailie. This report is a published snapshot.</p>""")

def geo_panel(key, s):
    cards=''.join(f'<div><strong>{n(s["reach"][k])}</strong><span>{label}</span></div>' for k,label in [('countries','Countries'),('regions','Provinces / states'),('cities','Cities')])
    tables=[]
    for dim,title in [('cities','Top 5 cities'),('states','Top 5 provinces / states'),('countries','Top 5 countries')]:
        rows=[]
        for r in s[dim][:5]:
            label=r['city'] if dim=='cities' else r['region'] if dim=='states' else r['country']
            context=esc(r['region']+', '+r['country']) if dim=='cities' else esc(r['country']) if dim=='states' else None
            rows.append('<tr><th scope="row">'+esc(label)+'</th>'+(f'<td>{context}</td>' if context else '')+f'<td>{n(r["tours"])}</td></tr>')
        middle='<th scope="col">Region / country</th>' if dim=='cities' else '<th scope="col">Country</th>' if dim=='states' else ''
        tables.append(f'<div class="geo-block"><h3>{title}</h3><table class="geo-table {dim}"><thead><tr><th scope="col">Name</th>{middle}<th scope="col">Tour opens</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>')
    return f'<div class="geo-panel" data-scope="{esc(key)}" {"hidden" if key!="portfolio" else ""}><h3 class="geo-scope-name">{esc(s["name"])}</h3><div class="reach-cards">{cards}</div>{"".join(tables)}</div>'
options=''.join(f'<option value="{esc(k)}">{esc(s["name"])}</option>' for k,s in scopes.items())
page('viewers-reached','02 / All-time geographic reach','Viewers reached',f"""<p class="note">Explore the portfolio’s reach or select a community. Rankings show the top five locations by recorded tour opens.</p><div class="geo-controls"><label for="geo-scope">Portfolio / community</label><select id="geo-scope" aria-controls="geo-results">{options}</select></div><div id="geo-results" aria-live="polite">{''.join(geo_panel(k,s) for k,s in scopes.items())}</div><p class="geo-note">Reach counts distinct locations in all tracked activity with complete country, region, and city fields, not people. Portfolio locations are deduplicated. Provinces / states includes equivalent international regions. Rankings exclude flagged bots and unknown locations, following dashboard exclusions of Pakistan, Philippines, and (for cities) Sterling Heights. Location is inferred from event geolocation.</p>""")

def hour_rows(group):
    rows=[]
    for p in group:
        sub=esc(p['hours']).replace('; ','<br>')
        tours=n(p['outside_hours_tours'])
        leads=n(p['outside_hours_leads'])
        if p['outside_hours_tours'] is not None:
            tours+=f'<span class="cell-sub">of {n(p["tours"])} opens</span>'
            leads+=f'<span class="cell-sub">{pct(p["outside_hours_leads"],p["leads"])} of leads</span>' if p['leads'] else ''
        rows.append(f'<tr><th scope="row">{prop(p)}<span class="cell-sub office-hours"><a href="{esc(p["website"])}" target="_blank" rel="noopener">{sub}</a></span></th><td>{tours}</td><td class="strong">{pct(p["outside_hours_tours"],p["tours"])}</td><td>{leads}</td></tr>')
    return ''.join(rows)
for i,group in enumerate([properties[:7],properties[7:]]):
    hero=f'<div class="timing-hero"><div><div class="n">{outside_pct}</div><div class="l">Of tours outside office hours</div></div><div><div class="n">{lead_pct}</div><div class="l">Of leads captured outside office hours</div></div></div>' if i==0 else ''
    footer=f'<tfoot><tr><th scope="row">12-property covered total</th><td>{n(totals["outside_hours_tours"])}<span class="cell-sub">of {n(totals["hours_covered_tours"])} opens</span></td><td>{outside_pct}</td><td>{n(totals["outside_hours_leads"])}<span class="cell-sub">of {n(totals["hours_covered_leads"])} leads</span></td></tr></tfoot>' if i else ''
    note='<p class="foot">Coverage: 12 properties with published hours. Appointment-only ALMA Sandy Hill is excluded from both timing numerators and denominators. Quartier Latin uses published tour hours.</p>'
    if i: note+='<p class="foot">Hours checked October 19, 2026 on the linked property websites and applied retrospectively in Eastern Time, including daylight saving time. Holidays and historical schedule changes are not modeled. Opening is included; closing is excluded. Lead timing uses creation timestamps.</p>'
    page('outside-hours' if not i else 'outside-hours-continued','03 / All-time tour timing'+(' · Continued' if i else ''),'Outside business hours',f'<p class="note">Activity beyond published office hours, evaluated in each property’s local Eastern Time. Office schedules appear beneath each property name.</p>{hero}<table class="hours-table"><thead><tr><th scope="col">Community</th><th scope="col">Outside-hours opens</th><th scope="col">Tour share</th><th scope="col">Outside-hours leads</th></tr></thead><tbody>{hour_rows(group)}</tbody>{footer}</table>{note}')
actions=''.join(f'<tr><th scope="row">{prop(p)}</th><td>{n(p["leads"])}</td><td>{n(p["scheduled_leads"])}</td></tr>' for p in properties)
page('next-steps','04 / Recorded next steps','From discovery to action',f"""<p class="note">Saved lead records show how prospects continued engaging through the tour experience.</p><div class="timing-hero"><div><div class="n">{n(totals['leads'])}</div><div class="l">Captured leads</div></div><div><div class="n">{n(totals['scheduled_leads'])}</div><div class="l">Leads with a scheduled tour</div></div></div><table class="outcomes-table"><caption>Saved leads with recorded next steps</caption><thead><tr><th scope="col">Community</th><th scope="col">Captured leads</th><th scope="col">Scheduled tour</th></tr></thead><tbody>{actions}</tbody><tfoot>{totalrow('Portfolio total',['leads','scheduled_leads'])}</tfoot></table><p class="foot">Scheduling counts each saved lead once when an appointment date and start time are present. These {n(totals['scheduled_leads'])} leads are a subset of captured leads and indicate bookings or requests, not confirmed attendance. Metadata reflects the retrieved state of leads created before the cutoff.</p>""")

def content_block(p):
    rows=[]
    for cat,label in [('amenities','Amenity'),('floor_plans','Floor plan')]:
        for i,r in enumerate(p['top_content'][cat],1):
            rows.append(f'<tr><th scope="row">{label} {i if cat=="amenities" else ""}</th><th scope="row">{esc(r["title"])}</th><td>{esc(r["format"])}</td><td>{n(r["selections"])}</td></tr>')
        if not p['top_content'][cat]:rows.append(f'<tr><th scope="row">{label}</th><td colspan="3" style="text-align:left">No attributable selections recorded</td></tr>')
    return f'<div class="content-block"><h3>{prop(p)}</h3><table class="ranking"><thead><tr><th scope="col">Category</th><th scope="col">Tour screen</th><th scope="col">Format</th><th scope="col">Selections</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
for start in range(0,len(properties),3):
    group=properties[start:start+3]
    page('most-explored' if start==0 else 'most-explored-'+str(start//3+1),'05 / Most explored · '+str(start//3+1)+' of 5','What visitors explore', '<p class="note">Top three amenities and the top floor-plan screen for each community, by all-time recorded selections. Fewer rows appear where fewer screens have recorded selections.</p>'+''.join(content_block(p) for p in group)+'<p class="foot">A selection is a recorded navigation to a tour screen; repeat selections count. Rankings exclude flagged bots, overview screens, and forms. These are selections, not watch duration or completed video views. Names and media types reflect the current tour configuration.</p>')
sections=[]
for i,(id,body) in enumerate(pages,1):
    foot=f'<footer class="pagefoot"><span>CSL / Forum portfolio performance · All time</span><span>Through October 18, 2026 UTC · {i:02d} / {len(pages):02d}</span></footer>'
    sections.append(f'<section class="page {"cover" if id=="overview" else ""}" id="{id}">{body}{foot}</section>')
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CSL / Forum Portfolio Performance Report</title><meta name="description" content="All-time performance across 13 live CSL / Forum and ALMA tours: tour opens, captured leads, geographic reach, office-hour activity and popular tour content."><style>'+CSS+'</style></head><body><main>'+''.join(sections)+"""</main><script>
document.getElementById('geo-scope').addEventListener('change', function () {
  document.querySelectorAll('.geo-panel').forEach(panel => { panel.hidden = panel.dataset.scope !== this.value; });
});
</script></body></html>"""
(ROOT/'public/csl-forum-portfolio-report.html').write_text(html)
print(f'Built {len(pages)} pages for {len(properties)} properties.')

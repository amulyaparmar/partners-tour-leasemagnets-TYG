#!/usr/bin/env python3
"""Render the public GHP report from its saved aggregate snapshot."""
import base64
import json
from email.utils import parsedate_to_datetime
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "data/reports/ghp-portfolio-2026-10-03.json").read_text())
properties = data["properties"]
totals = data["totals"]
geography = data["geography"]["scopes"]
engagement = data["engagement"]
actions = engagement["scopes"]
action_totals = engagement["totals"]


def n(value):
    return f"{value:,}"


def pct(part, whole):
    return f"{part / whole * 100:.1f}%" if whole else "—"


def date(value):
    return parsedate_to_datetime(value).strftime("%b %d, %Y").replace(" 0", " ")


def prop(p, url=False):
    return f'<a href="{escape(p["tour_url"])}" target="_blank" rel="noopener">{escape(p["name"])}</a>' + (f'<span class="raw-url">tour.video/v3/@{escape(p["alias"])}</span>' if url else "")


def head(label):
    return f'<div class="runhead"><span class="wordmark">LeaseMagnets · GHP</span><a href="#overview" class="eyebrow">Report index</a></div><div class="eyebrow">{label}</div>'


def foot(page):
    return f'<footer class="pagefoot"><span>GHP portfolio performance · All time</span><span>Through October 2, 2026 UTC · {page:02d} / 09</span></footer>'


ledger = "\n".join(f'<tr><th scope="row">{prop(p, True)}</th><td>{n(p["tours"])}</td><td>{n(p["leads"])}</td></tr>' for p in properties)
reach_rows = "\n".join(f'<tr><th scope="row">{prop(p)}</th>' + ''.join(f'<td>{n(geography[p["uuid"]]["reach"][key])}</td>' for key in ['countries', 'regions', 'cities']) + '</tr>' for p in properties)
history = "\n".join(f'<tr><th scope="row">{prop(p)}</th><td>{date(p["first_tour_at"])}</td><td>{date(p["latest_tour_at"])}</td></tr>' for p in properties)
hours = "\n".join(f'<tr><th scope="row">{prop(p)}</th><td>{n(p["outside_hours_tours"])}<span class="cell-sub">of {n(p["tours"])} tours</span></td><td class="strong">{pct(p["outside_hours_tours"], p["tours"])}</td><td>{n(p["outside_hours_leads"])}<span class="cell-sub">{pct(p["outside_hours_leads"], p["leads"])} of leads</span></td></tr>' for p in properties)
schedule = "\n".join(f'<tr><th scope="row"><a href="{escape(p["website"])}" target="_blank" rel="noopener">{escape(p["name"])}</a></th><td>{escape(p["hours"])}</td></tr>' for p in properties)
logo = base64.b64encode((ROOT / "public/logos/lm-logo-tyg.svg").read_bytes()).decode()
ghp_logo = base64.b64encode((ROOT / "public/logos/ghp-management.png").read_bytes()).decode()


def geographic_panel(scope_id, scope):
    reach = scope["reach"]
    cards = ''.join(f'<div><strong>{n(reach[k])}</strong><span>{label}</span></div>' for k, label in [('countries', 'Countries'), ('regions', 'States / regions'), ('cities', 'Cities')])
    tables = []
    for dimension, title in [('cities', 'Top 5 cities'), ('states', 'Top 5 states'), ('countries', 'Top 5 countries')]:
        rows = []
        for row in scope[dimension]:
            if dimension == 'cities':
                label = escape(row['city'])
                context = escape(row['region'] + ', ' + row['country'])
            elif dimension == 'states':
                label = escape(row['region'])
                context = escape(row['country'])
            else:
                label = escape(row['country'])
                context = None
            rows.append(f'<tr><th scope="row">{label}</th>' + (f'<td>{context}</td>' if context else '') + f'<td>{n(row["tours"])}</td></tr>')
        context_header = '<th scope="col">Region / country</th>' if dimension == 'cities' else '<th scope="col">Country</th>' if dimension == 'states' else ''
        tables.append(f'<div class="geo-block"><h3>{title}</h3><table class="geo-table {dimension}"><thead><tr><th scope="col">Name</th>{context_header}<th scope="col">Tours</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>')
    return f'<div class="geo-panel" data-scope="{escape(scope_id)}" {"hidden" if scope_id != "portfolio" else ""}><h3 class="geo-scope-name">{escape(scope["name"])}</h3><div class="reach-cards">{cards}</div>{"".join(tables)}</div>'


geographic_panels = ''.join(geographic_panel(key, value) for key, value in geography.items())
geographic_options = ''.join(f'<option value="{escape(key)}">{escape(value["name"])}</option>' for key, value in geography.items())

def outcome_rows(keys):
    return ''.join('<tr><th scope="row">' + prop(p) + '</th>' + ''.join(f'<td>{n(actions[p["uuid"]][key])}</td>' for key in keys) + '</tr>' for p in properties)


def outcome_total(keys):
    return '<tr><th scope="row">Portfolio total</th>' + ''.join(f'<td>{n(action_totals[key])}</td>' for key in keys) + '</tr>'


def content_table(rows, title):
    body = []
    for rank, row in enumerate(rows, 1):
        title_text = row['title'].strip()
        # Cosmetic capitalization of configuration labels; preserve unit types and 3D labels.
        if title_text.lower() in ['fitness center', 'fitness center1']:
            title_text = 'Fitness Center'
        body.append(f'<tr><td>{rank}</td><th scope="row">{escape(title_text)}</th><td>{escape(row["format"])}</td><td>{n(row["selections"])}</td></tr>')
    return f'<h3 class="subtitle">{title}</h3><table class="content-table"><thead><tr><th scope="col">Rank</th><th scope="col">Tour screen</th><th scope="col">Format</th><th scope="col">Selections</th></tr></thead><tbody>{"".join(body)}</tbody></table>'


content_pages = ''.join(f'''<section class="page content-page" id="most-explored{'' if i == 0 else '-' + p['alias']}" aria-labelledby="content-title-{i}">
  {head('06 / Most explored · ' + escape(p['name']))}
  <h2 class="title" id="content-title-{i}">{escape(p['name'])}</h2>
  <p class="note">The top five amenities and floor-plan screens by all-time recorded selections. <a href="{escape(p['tour_url'])}" target="_blank" rel="noopener">Open live tour</a><br><a href="#most-explored">The Lorenzo</a> · <a href="#most-explored-broadwaypalace">Broadway Palace</a> · <a href="#most-explored-ferrante">The Ferrante</a></p>
  {content_table(actions[p['uuid']]['amenities'], 'Top 5 amenities')}
  {content_table(actions[p['uuid']]['floor_plans'], 'Top 5 floor plans')}
  <p class="foot">A selection is a recorded click into that tour screen; repeat selections count. These rankings show what visitors explored, rather than watch time or completed views. Video and 3D screens are identified separately.</p>
  <p class="foot">All available selection events before the reporting cutoff; flagged bots, category overview screens, and form screens are excluded. Labels reflect the current tour configuration, so a screen’s content may have changed over time.</p>
  {foot(7+i)}
</section>''' for i, p in enumerate(properties))


html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GHP Portfolio Performance Report | The Lorenzo, Broadway Palace &amp; The Ferrante</title>
<meta name="description" content="All-time LeaseMagnets tour performance for GHP: The Lorenzo, Broadway Palace and The Ferrante. Tours, leads, engagement and outside-business-hours activity through October 2, 2026.">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&family=Inter:wght@400;500;600;700&display=swap');
@page{{size:8.5in 11in;margin:0}}
*{{box-sizing:border-box}}
html{{scroll-behavior:auto}}
body{{margin:0;background:#e1e2e3;color:#242424;font:14px Inter,Arial,sans-serif}}
a{{color:inherit;text-underline-offset:3px}}a:hover{{color:#a32c30}}a:focus-visible{{outline:2px solid #a32c30;outline-offset:4px}}
.page{{width:8.5in;min-height:11in;margin:28px auto;background:#fff;padding:.55in .85in;display:flex;flex-direction:column}}
.cover{{justify-content:space-between;padding:.92in .9in .82in}}
.eyebrow,.k{{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#777}}
.wordmark{{font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase}}
.brandmarks{{display:flex;align-items:center;gap:18px}}.lm-logo{{width:128px;height:auto}}.brand-divider{{color:#c4c5c7;font-size:17px}}
.ghp-logo{{width:84px;height:auto;display:block}}
.cover-top{{display:flex;align-items:center;justify-content:space-between;gap:24px}}
.display{{font-family:'Cal Sans',Inter,Arial,sans-serif;color:#141414;line-height:1.02}}
.cover h1{{font-size:58px;margin:18px 0 18px;letter-spacing:-.035em}}
.cover p{{max-width:520px;color:#6b7076;line-height:1.7}}
.property-list{{font-size:12px!important;color:#242424!important}}
.stats{{display:grid;grid-template-columns:1fr 1fr;gap:26px 30px;border-top:1px solid #e1e2e3;margin-top:30px;padding-top:24px}}
.n{{font:34px 'Cal Sans',Inter,Arial,sans-serif;letter-spacing:-.025em}}.l{{margin-top:7px;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:#777;line-height:1.6}}
.meta{{display:grid;grid-template-columns:1fr 1fr;gap:18px;background:#f4f4f4;padding:20px}}.v{{margin-top:8px;font-size:11px;line-height:1.6}}
.report-index{{display:grid;gap:9px;margin:26px 0;font-size:11px}}.report-index .k{{margin-bottom:3px}}.report-index a{{width:fit-content}}
.runhead{{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #e1e2e3;padding-bottom:12px;margin-bottom:24px}}
.title{{font:30px 'Cal Sans',Inter,Arial,sans-serif;letter-spacing:-.025em;margin:12px 0 10px;color:#141414}}
.subtitle{{font:22px 'Cal Sans',Inter,Arial,sans-serif;margin:24px 0 10px;color:#141414}}
.note,.foot{{color:#6b7076;font-size:10px;line-height:1.65}}.note{{margin:0 0 18px}}.foot{{margin:15px 0 0}}
.table-wrap{{width:100%;overflow-x:auto}}
table{{width:100%;table-layout:fixed;border-collapse:collapse;font-size:11px}}
caption{{text-align:left;font-size:11px;font-weight:600;margin-bottom:12px}}
thead th{{padding:12px 5px;border-bottom:1px solid #ddd;text-align:right;color:#777;font-size:8px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;line-height:1.6}}
tbody td,tbody th,tfoot td,tfoot th{{padding:11px 5px;border-bottom:1px solid #e1e2e3;text-align:right;font-weight:400;color:#6b7076;vertical-align:top;font-variant-numeric:tabular-nums}}
th:first-child{{text-align:left;width:38%}}tbody th{{font-weight:600;color:#242424}}tfoot th,tfoot td{{font-weight:600;color:#242424;border-top:2px solid #242424;padding-top:14px}}
.raw-url{{display:block;margin-top:8px;font-size:8px;font-weight:400;overflow-wrap:anywhere;line-height:1.5;color:#6b7076}}
.cell-sub{{display:block;margin-top:5px;font-size:9px;color:#777}}.strong{{font-weight:600;color:#141414}}
.callout{{background:#f4f4f4;padding:18px;margin-top:20px}}.callout p{{margin:8px 0 0;font-size:11px;color:#6b7076;line-height:1.7}}
.callout h3{{font-size:12px;font-weight:600;margin:0;line-height:1.5}}
.method{{margin:24px 0 0;display:grid;gap:12px}}.method p{{margin:0;font-size:10px;line-height:1.7;color:#6b7076}}.method strong{{color:#242424;font-weight:600}}
.pagefoot{{margin-top:auto;padding-top:24px;display:flex;justify-content:space-between;gap:20px;font-size:9px;color:#777;line-height:1.6}}
.cover .pagefoot{{margin-top:0;padding-top:15px}}
.share{{margin:16px 0}}.share-label{{display:flex;justify-content:space-between;gap:12px;font-size:11px;line-height:1.6}}.share-label span:last-child{{font-size:10px;color:#6b7076}}.share-label b{{font-weight:600;color:#242424}}
.track{{height:7px;background:#eee;margin-top:10px}}.track div{{height:100%;background:#242424}}
.dates th:first-child{{width:38%}}.dates td,.dates thead th{{text-align:left}}
.timing-hero{{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:5px 0 26px;padding:24px 0;border-top:1px solid #ddd;border-bottom:1px solid #ddd}}
.hours-table th:first-child{{width:32%}}.hours-table th:nth-child(2){{width:26%}}.hours-table th:nth-child(3){{width:18%}}.hours-table th:nth-child(4){{width:24%}}
.schedule td,.schedule thead th{{text-align:left}}.schedule td,.schedule tbody th{{padding:10px 5px;font-size:10px;line-height:1.6}}
.reach-cards{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f4f4f4;padding:17px;margin:12px 0 12px;text-align:center}}
.reach-cards strong{{display:block;font:26px 'Cal Sans',Inter,sans-serif}}.reach-cards span{{display:block;margin-top:6px;font-size:10px;color:#6b7076}}
.geo-controls{{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:4px 0 0;font-size:11px}}.geo-controls select{{font:inherit;background:#fff;border:1px solid #ccc;padding:8px 10px;max-width:70%;border-radius:3px}}
.geo-scope-name{{font-size:12px;font-weight:600;margin:12px 0 0}}.geo-block h3{{font:18px 'Cal Sans',Inter,sans-serif;margin:12px 0 3px}}
.geo-table thead th{{padding:5px;font-size:7px}}.geo-table tbody th,.geo-table tbody td{{padding:4px 5px;font-size:10px;line-height:1.4}}
.geo-table th:first-child{{width:38%}}.geo-table td:nth-child(2),.geo-table th:nth-child(2){{text-align:left}}.geo-table td:last-child,.geo-table th:last-child{{width:16%;text-align:right}}.geo-table.countries th:first-child{{width:84%}}
.content-table th:first-child,.content-table td:first-child{{width:8%;text-align:left}}.content-table th:nth-child(2){{width:52%;text-align:left}}.content-table th:nth-child(3){{width:16%}}.content-table th:last-child{{width:24%}}.content-table tbody td,.content-table tbody th{{padding:10px 5px}}.outcomes-table th:first-child{{width:34%}}
#next-steps .timing-hero{{padding:14px 0;margin-bottom:14px}}#next-steps tbody td,#next-steps tbody th,#next-steps tfoot td,#next-steps tfoot th{{padding-top:7px;padding-bottom:7px}}#next-steps .method{{margin-top:16px;gap:8px}}#next-steps .subtitle{{margin-top:18px}}
.geo-panel[hidden]{{display:none}}.geo-note{{font-size:9px;line-height:1.55;margin-top:12px;color:#6b7076}}
@media screen and (max-width:900px){{.page{{width:100%;min-height:100vh;margin:0;padding:32px 24px}}.cover{{gap:38px}}.cover h1{{font-size:48px}}.cover-top{{flex-wrap:wrap}}.pagefoot{{padding-top:32px}}}}
@media screen and (max-width:480px){{.page{{padding:26px 18px}}.cover h1{{font-size:44px}}.cover-top>.eyebrow{{font-size:8px}}.n{{font-size:30px}}.runhead{{flex-wrap:wrap}}table{{font-size:10px}}thead th{{font-size:7px;letter-spacing:.04em;padding-left:3px;padding-right:3px}}tbody td,tbody th,tfoot td,tfoot th{{padding-left:3px;padding-right:3px}}.raw-url{{font-size:7px}}.share-label{{display:block}}.share-label span{{display:block}}.meta{{padding:16px;gap:12px}}.pagefoot{{font-size:8px}}.title{{font-size:28px}}}}
@media print{{html{{scroll-behavior:auto}}body{{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}.page{{margin:0;height:11in;min-height:0;break-after:page}}.page:last-child{{break-after:auto}}.table-wrap{{overflow:visible}}a{{text-decoration:none}}.report-index a{{text-decoration:underline}}tr,.callout{{break-inside:avoid}}}}
@media(prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}}}
</style>
</head>
<body>
<main>
<section class="page cover" id="overview" aria-labelledby="report-title">
  <div class="cover-top"><div class="brandmarks"><img class="lm-logo" alt="LeaseMagnets" src="data:image/svg+xml;base64,{logo}"><span class="brand-divider" aria-hidden="true">×</span><a href="https://www.ghpmgmt.com/" target="_blank" rel="noopener"><img class="ghp-logo" alt="GHP Management" src="data:image/png;base64,{ghp_logo}"></a></div><span class="eyebrow">Portfolio intelligence</span></div>
  <div>
    <div class="eyebrow">GHP · Los Angeles, California</div>
    <h1 class="display" id="report-title">Portfolio<br>performance.</h1>
    <p>All-time virtual tour engagement, captured leads, and activity outside business hours across three GHP communities.</p>
    <p class="property-list">The Lorenzo · Broadway Palace · The Ferrante</p>
    <div class="stats">
      <div><div class="n">{n(totals['tours'])}</div><div class="l">All-time tours</div></div>
      <div><div class="n">{n(totals['leads'])}</div><div class="l">All-time captured leads</div></div>
      <div><div class="n">{n(totals['outside_hours_tours'])}</div><div class="l">Tours outside business hours</div></div>
      <div><div class="n">{pct(totals['outside_hours_tours'],totals['tours'])}</div><div class="l">Share of tours outside hours</div></div>
    </div>
  </div>
  <div>
    <nav class="report-index" aria-label="Report index"><span class="k">Report index</span><a href="#ledger">01 / Portfolio ledger</a><a href="#viewers-reached">02 / Viewers reached · Top 5 locations</a><a href="#activity">03 / Lifetime tour activity</a><a href="#outside-hours">04 / Outside business hours</a><a href="#next-steps">05 / Recorded next steps</a><a href="#most-explored">06 / Most explored amenities &amp; floor plans</a></nav>
    <div class="meta"><div><div class="k">Coverage</div><div class="v"><b>3 communities</b> · All recorded history</div></div><div><div class="k">Reporting cutoff</div><div class="v"><b>October 2, 2026</b> · End of day UTC</div></div></div>
    {foot(1)}
  </div>
</section>
<section class="page" id="ledger" aria-labelledby="ledger-title">
  {head('01 / Community-level results')}
  <h2 class="title" id="ledger-title">The portfolio ledger</h2>
  <p class="note">All-time results for the three active GHP tours. Every figure uses the same reporting cutoff; property names link directly to each live tour.</p>
  <div class="table-wrap"><table><caption>All-time tours and captured leads</caption><thead><tr><th scope="col">Community</th><th scope="col">Total tours</th><th scope="col">Captured leads</th></tr></thead><tbody>{ledger}</tbody><tfoot><tr><th scope="row">Portfolio total</th><td>{n(totals['tours'])}</td><td>{n(totals['leads'])}</td></tr></tfoot></table></div>
  <h3 class="subtitle">Viewers reached</h3>
  <p class="note">The geographic reach of all-time tracked activity, by community.</p>
  <div class="table-wrap"><table><thead><tr><th scope="col">Community</th><th scope="col">Countries</th><th scope="col">States / regions</th><th scope="col">Cities</th></tr></thead><tbody>{reach_rows}</tbody><tfoot><tr><th scope="row">Distinct portfolio reach</th><td>{n(geography['portfolio']['reach']['countries'])}</td><td>{n(geography['portfolio']['reach']['regions'])}</td><td>{n(geography['portfolio']['reach']['cities'])}</td></tr></tfoot></table></div>
  <p class="foot">Counts describe distinct locations represented in tracked activity, not a count of people. Portfolio reach is deduplicated across all three communities. <a href="#viewers-reached">Explore the top 5 cities, states, and countries →</a></p>
  {foot(2)}
</section>
<section class="page" id="viewers-reached" aria-labelledby="reach-title">
  {head('02 / All-time geographic reach')}
  <h2 class="title" id="reach-title">Viewers reached</h2>
  <p class="note">Explore the portfolio’s reach or select a community. Each ranking shows the top five locations by recorded tour opens.</p>
  <div class="geo-controls"><label for="geo-scope">Portfolio / community</label><select id="geo-scope" aria-controls="geo-results">{geographic_options}</select></div>
  <div id="geo-results" aria-live="polite">{geographic_panels}</div>
  <p class="geo-note">Reach counts use all tracked activity with complete geographic fields; they count locations, not people. States include equivalent international regions. Rankings use tour-open events, exclude flagged bots and unknown locations, and follow dashboard exclusions: Pakistan, Philippines, and (for cities) Sterling Heights. Location is inferred from event geolocation.</p>
  {foot(3)}
</section>
<section class="page" id="activity" aria-labelledby="activity-title">
  {head('03 / All-time tour activity')}
  <h2 class="title" id="activity-title">A lifetime of property discovery</h2>
  <h3 class="subtitle">Recorded tour history</h3>
  <div class="table-wrap"><table class="dates"><thead><tr><th scope="col">Community</th><th scope="col">First recorded tour</th><th scope="col">Latest recorded tour</th></tr></thead><tbody>{history}</tbody></table></div>
  <p class="foot">Dates are UTC. First recorded tour means the earliest retained tour-open event, not the production date or a confirmed launch date. Each property has a different length of recorded history.</p>
  <div class="method">
    <p><strong>Tours.</strong> Counts of <code>open_tour</code> events from the Tour analytics event store. Each property’s UUID, alias, and @alias are mapped to the same tour. Repeat opens can be counted; these are not unique people or completed walkthroughs.</p>
    <p><strong>Leads.</strong> Saved lead records attached to each canonical tour, created before the cutoff. Repeated form-submission events are not substituted for captured leads. The report contains aggregate counts only.</p>
    <p><strong>Snapshot.</strong> Retrieved October 3, 2026. All-time means all available records before October 3, 2026 at 00:00 UTC. This published snapshot does not refresh automatically.</p>
  </div>
  {foot(4)}
</section>
<section class="page" id="outside-hours" aria-labelledby="hours-title">
  {head('04 / All-time tour timing')}
  <h2 class="title" id="hours-title">Outside business hours</h2>
  <p class="note">Tour activity continues beyond published leasing-office hours. All-time timestamps are evaluated in Los Angeles local time, including daylight saving time.</p>
  <div class="timing-hero"><div><div class="n">{pct(totals['outside_hours_tours'],totals['tours'])}</div><div class="l">Of tours outside office hours</div></div><div><div class="n">{pct(totals['outside_hours_leads'],totals['leads'])}</div><div class="l">Of leads captured outside office hours</div></div></div>
  <div class="table-wrap"><table class="hours-table"><thead><tr><th scope="col">Community</th><th scope="col">Outside-hours tours</th><th scope="col">Tour share</th><th scope="col">Outside-hours leads</th></tr></thead><tbody>{hours}</tbody><tfoot><tr><th scope="row">Portfolio total</th><td>{n(totals['outside_hours_tours'])}<span class="cell-sub">of {n(totals['tours'])} tours</span></td><td>{pct(totals['outside_hours_tours'],totals['tours'])}</td><td>{n(totals['outside_hours_leads'])}<span class="cell-sub">{pct(totals['outside_hours_leads'],totals['leads'])} of leads</span></td></tr></tfoot></table></div>
  <h3 class="subtitle">Business hours used</h3>
  <div class="table-wrap"><table class="schedule"><thead><tr><th scope="col">Property / source website</th><th scope="col">Los Angeles local time</th></tr></thead><tbody>{schedule}</tbody></table></div>
  <p class="foot">Hours checked October 3, 2026 on the linked property websites: visible office hours for The Lorenzo and Broadway Palace; structured website data for The Ferrante. Broadway Palace’s visible hours take precedence over conflicting embedded metadata.</p>
  <p class="foot">Current schedules are applied retrospectively across all recorded history; holidays and past schedule changes are not modeled. Opening time is included; closing time is excluded. Lead timing uses the saved lead’s creation timestamp. Portfolio percentages use combined counts, not an average of property percentages.</p>
  {foot(5)}
</section>
<section class="page" id="next-steps" aria-labelledby="next-steps-title">
  {head('05 / Recorded next steps')}
  <h2 class="title" id="next-steps-title">From discovery to action</h2>
  <p class="note">Recorded scheduling and question submissions show how prospects continued engaging through the tour experience.</p>
  <div class="timing-hero"><div><div class="n">{n(action_totals['scheduled_leads'])}</div><div class="l">Leads with a scheduled tour</div></div><div><div class="n">{n(action_totals['question_leads'])}</div><div class="l">Leads with a submitted question</div></div></div>
  <table><caption>Saved leads with recorded next steps</caption><thead><tr><th scope="col">Community</th><th scope="col">Scheduled tour</th><th scope="col">Ask a Question</th></tr></thead><tbody>{outcome_rows(['scheduled_leads', 'question_leads'])}</tbody><tfoot>{outcome_total(['scheduled_leads', 'question_leads'])}</tfoot></table>
  <p class="foot">Each column counts saved lead records once per community. Scheduling requires an appointment date and start time; questions require a submitted message. These are subsets of the {n(totals['leads'])} captured leads, with one Lorenzo lead appearing in both columns. Scheduling records indicate bookings or requests, not confirmed attendance.</p>
  <p class="foot">In {n(action_totals['application_page_sessions'])} visits, viewers opened the tour and subsequently proceeded to the Broadway Palace application page.</p>
  <div class="method">
    <p><strong>Coverage.</strong> Lead outcomes use metadata as retrieved for leads created before the cutoff; historical metadata can be updated later. Available tracking differs by property and period.</p>
  </div>
  {foot(6)}
</section>
{content_pages}
</main>
<script>
document.getElementById('geo-scope').addEventListener('change', function () {{
  document.querySelectorAll('.geo-panel').forEach(panel => {{ panel.hidden = panel.dataset.scope !== this.value; }});
}});
</script>
</body>
</html>
'''

out = ROOT / "public/ghp-portfolio-report.html"
out.write_text(html)
print(f"Wrote {out} ({len(html):,} characters)")

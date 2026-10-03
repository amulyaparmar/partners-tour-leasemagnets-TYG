#!/usr/bin/env python3
"""Read aggregate GHP tour performance; never write to the source databases."""
import concurrent.futures
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data/reports/ghp-portfolio-2026-10-03.json"
CUTOFF = "2026-10-03T00:00:00+00:00"
PROPERTIES = [
    {"name": "The Lorenzo", "community_id": 421, "uuid": "02995a71-2170-48c1-9490-34c81207a3c7", "alias": "thelorenzo", "launch_date": "2023-05-01", "launch_date_source": "User-provided tour launch date", "website": "https://www.thelorenzo.com/", "weekday_close": 18, "hours": "Daily, 9 AM–6 PM", "hours_source": "Website footer and structured data"},
    {"name": "Broadway Palace", "community_id": 465, "uuid": "85105533-7b42-4a1b-8c05-0d6d390a7501", "alias": "broadwaypalace", "launch_date": "2023-11-11", "launch_date_source": "User-provided tour launch date", "website": "https://www.broadwaypalaceapartments.com/", "weekday_close": 18, "hours": "Daily, 9 AM–6 PM", "hours_source": "Visible website office hours; used in preference to conflicting embedded metadata"},
    {"name": "The Ferrante", "community_id": 456, "uuid": "5db44776-df6c-477b-beec-9ac7146517f2", "alias": "ferrante", "launch_date": "2023-11-10", "launch_date_source": "User-provided tour launch date", "website": "https://www.ferranteapts.com/", "weekday_close": 19, "hours": "Mon–Fri, 9 AM–7 PM; Sat–Sun, 9 AM–6 PM", "hours_source": "Website structured data"},
]


def request(url, *, headers=None, body=None):
    req = urllib.request.Request(url, headers=headers or {}, data=json.dumps(body).encode() if body is not None else None)
    with urllib.request.urlopen(req, timeout=180) as res:
        return json.load(res), dict(res.headers)


def env():
    values = dict(os.environ)
    for line in (ROOT / ".env.local").read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            values.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    return values


def bq(query):
    result, _ = request("https://api.leasemagnets.com/run_sqlquery_inbigquery", headers={"content-type": "application/json", "origin": "https://leasemagnets.ai", "referer": "https://leasemagnets.ai/", "user-agent": "Mozilla/5.0"}, body={"querystring": query})
    if result.get("status") != "success" or result.get("error"):
        raise RuntimeError(f"Aggregate query failed: {result}")
    return result["res"]


def main():
    e = env()
    base = (e.get("NEXT_PUBLIC_SUPABASE_URL") or e.get("SUPABASE_URL")).rstrip("/")
    key = e.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or e.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or e.get("SUPABASE_ANON_KEY") or e.get("SUPABASE_KEY")
    headers = {"apikey": key, "Authorization": "Bearer " + key}

    def rest(table, params):
        url = base + "/rest/v1/" + table + "?" + urllib.parse.urlencode(params)
        rows = []
        for start in range(0, 100000, 1000):
            page, _ = request(url, headers={**headers, "Range": f"{start}-{start + 999}"})
            rows.extend(page)
            if len(page) < 1000:
                return rows
        raise RuntimeError("Pagination limit exceeded")

    def leads(p):
        # Only timestamps and a lease flag are read. No prospect contact data.
        rows = rest("Lead", {"select": "time,leased", "magnet_uuid": "eq." + p["uuid"], "time": "lt." + CUTOFF, "order": "time.asc,id.asc"})
        outside = 0
        from zoneinfo import ZoneInfo
        for row in rows:
            timestamp = re.sub(r"\.(\d+)", lambda m: "." + m[1].ljust(6, "0")[:6], row["time"].replace("Z", "+00:00"))
            local = datetime.fromisoformat(timestamp).astimezone(ZoneInfo("America/Los_Angeles"))
            close = p["weekday_close"] if local.weekday() < 5 else 18
            outside += not (9 <= local.hour < close)
        return {"leads": len(rows), "outside_hours_leads": outside, "lead_records_marked_leased": sum(r.get("leased") is True for r in rows), "first_lead_at": rows[0]["time"] if rows else None}

    structs = []
    for p in PROPERTIES:
        for identifier in [p["uuid"], p["alias"], "@" + p["alias"]]:
            structs.append(f"STRUCT('{p['uuid']}' AS uuid, '{identifier}' AS event_id, {p['weekday_close']} AS weekday_close)")
    mapping = ",".join(structs)
    prefix = f"""WITH mapping AS (SELECT * FROM UNNEST([{mapping}])),
    events AS (
      SELECT m.uuid, e.*, DATETIME(e._timestamp, 'America/Los_Angeles') AS local_time,
      m.weekday_close FROM mapping m JOIN `default.events` e ON e.magnet_uuid = m.event_id
      WHERE e._timestamp < TIMESTAMP('{CUTOFF}')
    ), classified AS (
      SELECT *, NOT (EXTRACT(HOUR FROM local_time) >= 9 AND EXTRACT(HOUR FROM local_time) <
      IF(EXTRACT(DAYOFWEEK FROM local_time) BETWEEN 2 AND 6, weekday_close, 18)) AS outside_hours
      FROM events
    ) """
    query = prefix + """SELECT uuid, COUNTIF(event_type='open_tour'),
      COUNT(DISTINCT user_anonymous_id), COUNT(DISTINCT visit_uuid),
      COUNTIF(event_type='open_tour' AND outside_hours),
      COUNTIF(event_type='open_tour' AND NOT outside_hours),
      MIN(IF(event_type='open_tour', _timestamp, NULL)),
      MAX(IF(event_type='open_tour', _timestamp, NULL)),
      COUNTIF(event_type='form_submission')
      FROM classified GROUP BY uuid ORDER BY uuid"""
    years_query = prefix + """SELECT uuid, EXTRACT(YEAR FROM _timestamp), COUNT(*)
      FROM classified WHERE event_type='open_tour' GROUP BY 1,2 ORDER BY 1,2"""

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        counts_future = pool.submit(bq, query)
        years_future = pool.submit(bq, years_query)
        lead_futures = {p["uuid"]: pool.submit(leads, p) for p in PROPERTIES}
        communities = rest("Community", {"select": "id,name,enabled,hidden,alias", "id": "in.(421,465,456)"})
        assert len(communities) == 3 and all(p["enabled"] and not p["hidden"] for p in communities)
        magnets = rest("Magnet", {"select": "uuid,community_id,alias", "community_id": "in.(421,465,456)"})
        for p in PROPERTIES:
            assert any(m["uuid"] == p["uuid"] and m["alias"] == p["alias"] and m["community_id"] == p["community_id"] for m in magnets)
        counts = {row[0]: dict(zip(["tours", "visitors", "visits", "outside_hours_tours", "inside_hours_tours", "first_tour_at", "latest_tour_at", "form_submission_events"], row[1:])) for row in counts_future.result()}
        years = years_future.result()
        rows = []
        for p in PROPERTIES:
            row = {**p, **counts[p["uuid"]], **lead_futures[p["uuid"]].result(), "tour_url": "https://tour.video/v3/@" + p["alias"]}
            row["annual_tours"] = {str(y): n for uuid, y, n in years if uuid == p["uuid"]}
            assert row["tours"] == sum(row["annual_tours"].values())
            assert row["tours"] == row["outside_hours_tours"] + row["inside_hours_tours"]
            rows.append(row)
    keys = ["tours", "leads", "outside_hours_tours", "inside_hours_tours", "outside_hours_leads", "lead_records_marked_leased"]
    result = {"generated_at": datetime.now(timezone.utc).isoformat(), "cutoff_exclusive_utc": CUTOFF, "scope": "All recorded history for the three canonical GHP tours, through October 2, 2026 UTC", "business_hours_timezone": "America/Los_Angeles", "business_hours_method": "Current property website hours, checked October 3, 2026, applied retrospectively. Holidays and historical schedule changes are not modeled.", "tour_definition": "Count of open_tour events; aliases and UUIDs mapped to one property. Not a count of unique people or completed tours.", "lead_definition": "Saved Lead rows before the cutoff; no deduplication or cohort attribution implied. Form-submission events are not used as the lead count.", "lease_definition": "Current leased flag on lead records created before the cutoff; not verified lease contracts or lease-date attribution.", "totals": {k: sum(r[k] for r in rows) for k in keys}, "properties": rows, "queries": {"totals": query, "annual_tours": years_query}}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"output": str(OUT), "totals": result["totals"], "properties": [{k: p[k] for k in ["name", "tours", "leads", "outside_hours_tours", "outside_hours_leads", "first_tour_at", "latest_tour_at", "lead_records_marked_leased"]} for p in rows]}, indent=2))


if __name__ == "__main__":
    main()

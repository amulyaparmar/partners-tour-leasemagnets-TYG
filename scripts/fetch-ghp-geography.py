#!/usr/bin/env python3
"""Add aggregate geographic reach to the existing GHP reporting snapshot."""
import concurrent.futures
import importlib.util
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("ghp", ROOT / "scripts/fetch-ghp-report.py")
ghp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ghp)
source = ROOT / "data/reports/ghp-portfolio-2026-10-03.json"
data = json.loads(source.read_text())
mapping = []
for p in data["properties"]:
    for identifier in [p["uuid"], p["alias"], "@" + p["alias"]]:
        mapping.append(f"STRUCT('{p['uuid']}' AS scope, '{identifier}' AS event_id)")
prefix = f"""WITH mapping AS (SELECT * FROM UNNEST([{','.join(mapping)}])),
events AS (
 SELECT m.scope, e.event_type, e.parsed_ua_bot,
 NULLIF(TRIM(e.location_country_name), '') AS country,
 NULLIF(TRIM(e.location_region), '') AS region,
 NULLIF(TRIM(e.location_city), '') AS city
 FROM mapping m JOIN `default.events` e ON e.magnet_uuid=m.event_id
 WHERE e._timestamp < TIMESTAMP('{data['cutoff_exclusive_utc']}')
), scoped AS (
 SELECT * FROM events UNION ALL
 SELECT 'portfolio' AS scope, event_type, parsed_ua_bot, country, region, city FROM events
) """
queries = {"reach": prefix + """SELECT scope, COUNT(DISTINCT country),
 COUNT(DISTINCT TO_JSON_STRING(STRUCT(country, region))),
 COUNT(DISTINCT TO_JSON_STRING(STRUCT(country, region, city)))
 FROM scoped WHERE country IS NOT NULL AND region IS NOT NULL AND city IS NOT NULL
 GROUP BY scope"""}
for dimension, fields, condition in [
    ("cities", "city, region, country", "city IS NOT NULL AND region IS NOT NULL AND country IS NOT NULL"),
    ("states", "region, country", "region IS NOT NULL AND country IS NOT NULL"),
    ("countries", "country", "country IS NOT NULL"),
]:
    # Match the existing ReportsAndAnalyticsTYG location exclusions, before ranking.
    condition += " AND LOWER(country) NOT IN ('pakistan', 'philippines')"
    if dimension == "cities":
        condition += " AND LOWER(city) != 'sterling heights'"
    queries[dimension] = prefix + f""", ranked AS (
 SELECT scope, {fields}, COUNT(*) AS tours FROM scoped
 WHERE event_type='open_tour' AND (parsed_ua_bot=FALSE OR parsed_ua_bot IS NULL)
 AND {condition}
 GROUP BY scope, {fields}
) SELECT * FROM ranked
QUALIFY ROW_NUMBER() OVER(PARTITION BY scope ORDER BY tours DESC, {fields}) <= 5
ORDER BY scope, tours DESC, {fields}"""

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = dict(zip(queries, pool.map(ghp.bq, queries.values())))

scopes = {"portfolio": {"name": "GHP portfolio"}}
scopes.update({p["uuid"]: {"name": p["name"]} for p in data["properties"]})
for scope, countries, regions, cities in results["reach"]:
    scopes[scope]["reach"] = {"countries": countries, "regions": regions, "cities": cities}
for dimension in ["cities", "states", "countries"]:
    keys = {"cities": ["city", "region", "country", "tours"], "states": ["region", "country", "tours"], "countries": ["country", "tours"]}[dimension]
    for scope in scopes:
        scopes[scope][dimension] = [dict(zip(keys, row[1:])) for row in results[dimension] if row[0] == scope]
        assert len(scopes[scope][dimension]) == 5
        assert all(r["tours"] > 0 for r in scopes[scope][dimension])
data["geography"] = {
    "retrieved_at": datetime.now(timezone.utc).isoformat(),
    "reach_definition": "Distinct countries, regions and city/region/country combinations in all tracked activity with complete geographic fields, through the report cutoff. Counts describe locations, not people. Portfolio locations are deduplicated across properties.",
    "ranking_definition": "Top five locations by open_tour event count, excluding flagged bots and unknown/blank location fields. Matches dashboard exclusions: Pakistan and Philippines in every ranking, plus Sterling Heights in city rankings. Exclusions applied before selecting the top five. State means state or equivalent international region.",
    "scopes": scopes,
    "queries": queries,
}
data["brand_asset"] = {"source": "https://www.ghpmgmt.com/gridmedia/img/footer-logo.png", "website": "https://www.ghpmgmt.com/", "local_path": "public/logos/ghp-management.png"}
source.write_text(json.dumps(data, indent=2) + "\n")
for scope in scopes.values():
    print(json.dumps({"scope": scope["name"], "reach": scope["reach"], "top_city": scope["cities"][0]}))

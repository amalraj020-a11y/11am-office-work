#!/usr/bin/env python3
"""Generate one guarded daily startup prototype from an OpenAI-compatible API."""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path, PurePosixPath
from typing import Any
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
IST = ZoneInfo("Asia/Kolkata")
ALLOWED_SUFFIXES = {".html", ".css", ".js", ".json", ".md", ".txt", ".svg"}
MAX_FILES = 15
MAX_TOTAL_BYTES = 300_000


class FactoryError(RuntimeError):
    pass


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mission", choices=("website", "application"), required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--date", help="Optional historical IST mission date (YYYY-MM-DD)")
    return parser.parse_args()


def mission_date(value: str | None) -> str:
    current = dt.datetime.now(IST).date()
    if not value:
        return current.isoformat()
    try:
        requested = dt.date.fromisoformat(value)
    except ValueError as exc:
        raise FactoryError("Mission date must use YYYY-MM-DD format") from exc
    if requested > current:
        raise FactoryError("Mission date cannot be in the future")
    if requested < current - dt.timedelta(days=7):
        raise FactoryError("Catch-up missions are limited to the previous seven days")
    return requested.isoformat()


def existing_catalog() -> str:
    path = ROOT / "CATALOG.md"
    return path.read_text(encoding="utf-8")[-20_000:] if path.exists() else "No prior products."


def startup_schema() -> dict[str, Any]:
    string_array = {"type": "array", "items": {"type": "string"}}
    properties: dict[str, Any] = {
        "project_name": {"type": "string"},
        "slug": {"type": "string"},
        "problem": {"type": "string"},
        "solution": {"type": "string"},
        "target_customers": string_array,
        "competitors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "url": {"type": "string"},
                    "difference": {"type": "string"},
                    "verified": {"type": "boolean"},
                },
                "required": ["name", "url", "difference", "verified"],
                "additionalProperties": False,
            },
        },
        "features": string_array,
        "tech_stack": string_array,
        "monetization": {
            "type": "object",
            "properties": {
                "model": {"type": "string"},
                "pricing_hypothesis": {"type": "string"},
                "free_tier": {"type": "string"},
            },
            "required": ["model", "pricing_hypothesis", "free_tier"],
            "additionalProperties": False,
        },
        "free_hosting": {"type": "string"},
        "operating_costs": string_array,
        "launch_strategy": string_array,
        "potential_customers": string_array,
        "marketing_content": {
            "type": "object",
            "properties": {
                "tagline": {"type": "string"},
                "social_post": {"type": "string"},
            },
            "required": ["tagline", "social_post"],
            "additionalProperties": False,
        },
        "tests": string_array,
        "next_improvements": string_array,
        "files": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"path": {"type": "string"}, "content": {"type": "string"}},
                "required": ["path", "content"],
                "additionalProperties": False,
            },
        },
    }
    return {
        "type": "object",
        "properties": properties,
        "required": list(properties),
        "additionalProperties": False,
    }


def provider_response(mission: str, today: str) -> dict[str, Any]:
    api_key = os.environ.get("AI_API_KEY", "").strip()
    api_base = os.environ.get("AI_API_BASE", "").strip().rstrip("/")
    model = os.environ.get("AI_MODEL", "").strip()
    missing = [name for name, value in (("AI_API_KEY", api_key), ("AI_API_BASE", api_base), ("AI_MODEL", model)) if not value]
    if missing:
        raise FactoryError("Missing AI configuration: " + ", ".join(missing))
    payload = {
        "model": model,
        "temperature": 0.7,
        "max_completion_tokens": 16_000,
        "reasoning_effort": "low",
        "response_format": {
            "type": "json_schema",
            "json_schema": {"name": "daily_startup", "strict": True, "schema": startup_schema()},
        },
        "messages": [
            {"role": "system", "content": (ROOT / "prompts" / "master_prompt.md").read_text(encoding="utf-8")},
            {"role": "user", "content": f"Mission: {mission}\nIST date: {today}\nExisting catalog (do not repeat):\n{existing_catalog()}"},
        ],
    }
    repair_message = (
        "Your previous response was not valid JSON. Return the same complete product again as one valid JSON object. "
        "Use only plain ASCII in prose, escape every newline inside file content as \\n, and include no Markdown fence or commentary."
    )
    last_error = "AI provider did not return the required JSON object"
    for attempt in range(3):
        request = urllib.request.Request(
            f"{api_base}/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Amala-Daily-Startup-Factory/1.0 (+https://github.com/amalraj020-a11y/11am-office-work)",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                body = json.load(response)
        except urllib.error.HTTPError as exc:
            detail = exc.read(2_000).decode("utf-8", errors="replace")
            last_error = f"AI provider returned HTTP {exc.code}: {detail}"
            if exc.code == 400 and "json_validate_failed" in detail and attempt < 2:
                payload["temperature"] = 0.1
                payload["messages"].append({"role": "user", "content": repair_message})
                continue
            raise FactoryError(last_error) from exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise FactoryError(f"AI provider request failed: {exc}") from exc
        try:
            candidate = json.loads(body["choices"][0]["message"]["content"])
            if not isinstance(candidate, dict):
                raise FactoryError("AI provider response must be one JSON object")
            validate_payload(candidate)
            return candidate
        except (KeyError, IndexError, TypeError, json.JSONDecodeError):
            last_error = "AI provider response body was not valid JSON"
        except FactoryError as exc:
            last_error = str(exc)
        if attempt < 2:
            payload["temperature"] = 0.1
            payload["messages"].append(
                {
                    "role": "user",
                    "content": f"Repair the complete JSON product. Validation failed: {last_error}. {repair_message}",
                }
            )
            continue
    raise FactoryError(last_error)


def dry_run_response(mission: str) -> dict[str, Any]:
    name = "Queue Calm" if mission == "website" else "Focus Sprint"
    slug = "queue-calm" if mission == "website" else "focus-sprint"
    problem = "People lose time because small service queues have no simple public status page." if mission == "website" else "Students need a private, distraction-free way to plan short study sprints."
    return {
        "project_name": name,
        "slug": slug,
        "problem": problem,
        "solution": "A small offline-first browser tool that demonstrates the core workflow.",
        "target_customers": ["students", "small local teams"],
        "competitors": [],
        "features": ["Add an item", "Save state locally", "Responsive interface"],
        "tech_stack": ["HTML", "CSS", "JavaScript"],
        "monetization": {"model": "freemium", "pricing_hypothesis": "Test a ₹99/month optional team tier", "free_tier": "Core single-user workflow"},
        "free_hosting": "GitHub Pages",
        "operating_costs": ["Prototype hosting: ₹0 within GitHub Pages limits"],
        "launch_strategy": ["Ask five target users for feedback before public outreach"],
        "potential_customers": ["student groups", "small appointment-based businesses"],
        "marketing_content": {"tagline": f"{name}: one useful step at a time", "social_post": "Prototype ready for honest early feedback; no revenue claims."},
        "tests": ["Add an item and confirm it appears", "Reload and confirm saved data remains"],
        "next_improvements": ["Conduct user interviews", "Add export and import"],
        "files": [
            {"path": "index.html", "content": f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{name}</title><link rel="stylesheet" href="styles.css"></head><body><main><h1>{name}</h1><p>{problem}</p><form id="form"><label for="item">New item</label><input id="item" required maxlength="80"><button>Add</button></form><ul id="list" aria-live="polite"></ul></main><script src="app.js"></script></body></html>'''},
            {"path": "styles.css", "content": "*{box-sizing:border-box}body{font-family:system-ui;margin:0;background:#f5f7fb;color:#172033}main{width:min(680px,92%);margin:4rem auto;background:white;padding:2rem;border-radius:1rem;box-shadow:0 1rem 3rem #17203318}form{display:flex;gap:.5rem;flex-wrap:wrap}label{width:100%;font-weight:700}input{flex:1;min-width:12rem;padding:.8rem}button{padding:.8rem 1.2rem;background:#3157d5;color:white;border:0;border-radius:.5rem}li{margin:.6rem 0}@media(max-width:480px){main{margin:1rem auto;padding:1.2rem}}"},
            {"path": "app.js", "content": "const key='amala-items';const list=document.querySelector('#list');let items=JSON.parse(localStorage.getItem(key)||'[]');function draw(){list.innerHTML='';items.forEach(x=>{const li=document.createElement('li');li.textContent=x;list.append(li)})}document.querySelector('#form').addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#item');items.push(input.value.trim());localStorage.setItem(key,JSON.stringify(items));input.value='';draw()});draw();"},
            {"path": "README.md", "content": f"# {name}\n\nDeterministic dry-run prototype for validating the factory.\n\n## Test\n\nOpen `index.html`, add an item, then reload and confirm it remains.\n\n## Business hypothesis\n\nFreemium idea requiring user validation. Revenue is not guaranteed.\n\n## Limitations\n\nLocal browser storage only; no accounts or remote backend.\n"},
        ],
    }


def safe_slug(value: Any) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", str(value).lower()).strip("-")[:60]
    if not slug:
        raise FactoryError("Project slug is empty or invalid")
    return slug


def validate_payload(data: dict[str, Any]) -> None:
    required = {"project_name", "slug", "problem", "solution", "target_customers", "features", "monetization", "files"}
    missing = sorted(required - data.keys())
    if missing:
        raise FactoryError("Generated JSON is missing: " + ", ".join(missing))
    files = data.get("files")
    if not isinstance(files, list) or not 4 <= len(files) <= MAX_FILES:
        raise FactoryError(f"Product must contain 4-{MAX_FILES} files")
    paths: set[str] = set()
    total = 0
    for item in files:
        if not isinstance(item, dict) or not isinstance(item.get("path"), str) or not isinstance(item.get("content"), str):
            raise FactoryError("Every file needs text path and content values")
        raw = item["path"].replace("\\", "/")
        path = PurePosixPath(raw)
        if path.is_absolute() or ".." in path.parts or not path.parts or path.parts[0].startswith("."):
            raise FactoryError(f"Unsafe generated path: {raw}")
        if path.suffix.lower() not in ALLOWED_SUFFIXES:
            raise FactoryError(f"Unsupported file type: {raw}")
        if raw in paths:
            raise FactoryError(f"Duplicate path: {raw}")
        paths.add(raw)
        total += len(item["content"].encode("utf-8"))
    if total > MAX_TOTAL_BYTES:
        raise FactoryError("Generated files exceed the 300 KB safety limit")
    for required_path in ("index.html", "README.md"):
        if required_path not in paths:
            raise FactoryError(f"Product is missing {required_path}")


def next_day_number(parent: Path) -> int:
    numbers = []
    if parent.exists():
        for child in parent.iterdir():
            match = re.match(r"day-(\d{3,})-", child.name)
            if match:
                numbers.append(int(match.group(1)))
    return max(numbers, default=0) + 1


def write_project(data: dict[str, Any], mission: str, today: str) -> Path:
    parent = ROOT / ("websites" if mission == "website" else "applications")
    parent.mkdir(parents=True, exist_ok=True)
    project_dir = parent / f"day-{next_day_number(parent):03d}-{safe_slug(data['slug'])}"
    if project_dir.exists():
        raise FactoryError(f"Project directory already exists: {project_dir}")
    project_dir.mkdir()
    for item in data["files"]:
        destination = project_dir.joinpath(*PurePosixPath(item["path"]).parts)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(item["content"], encoding="utf-8")
    metadata = {key: value for key, value in data.items() if key != "files"}
    metadata.update({"mission": mission, "ist_date": today, "generated_at": dt.datetime.now(IST).isoformat()})
    (project_dir / "project.json").write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return project_dir


def markdown_list(values: Any) -> str:
    return "\n".join(f"- {value}" for value in values) if isinstance(values, list) and values else "- Not supplied"


def write_reports(data: dict[str, Any], project_dir: Path, mission: str, today: str) -> tuple[Path, Path]:
    relative = project_dir.relative_to(ROOT).as_posix()
    daily_dir = ROOT / "reports" / "daily-reports"
    revenue_dir = ROOT / "reports" / "revenue-reports"
    daily_dir.mkdir(parents=True, exist_ok=True)
    revenue_dir.mkdir(parents=True, exist_ok=True)
    competitors = []
    for item in data.get("competitors", []):
        if isinstance(item, dict):
            competitors.append(f"- {item.get('name', 'Unknown')}: {item.get('difference', '')} ({item.get('url') or 'no URL'}; human verification required)")
    daily = daily_dir / f"{today}-{mission}.md"
    daily.write_text(
        f"# {today} — {data['project_name']}\n\n- **Mission:** {mission}\n- **Project:** `{relative}`\n- **Deployment:** attempted only after validation\n"
        f"\n## Problem\n\n{data['problem']}\n\n## Solution\n\n{data['solution']}\n"
        f"\n## Target customers\n\n{markdown_list(data.get('target_customers'))}\n"
        f"\n## Features completed\n\n{markdown_list(data.get('features'))}\n"
        f"\n## Technologies\n\n{markdown_list(data.get('tech_stack'))}\n"
        f"\n## Competitor notes\n\n{chr(10).join(competitors) or '- No competitor claims supplied.'}\n"
        f"\n## Test scenarios\n\n{markdown_list(data.get('tests'))}\n"
        f"\n## Next improvements\n\n{markdown_list(data.get('next_improvements'))}\n\n"
        "> Market and competitor statements are model-generated research leads requiring human verification.\n",
        encoding="utf-8",
    )
    money = data.get("monetization", {}) if isinstance(data.get("monetization"), dict) else {}
    marketing = data.get("marketing_content", {}) if isinstance(data.get("marketing_content"), dict) else {}
    revenue = revenue_dir / f"{today}-{mission}.md"
    revenue.write_text(
        f"# Revenue hypothesis — {data['project_name']}\n\n- **Model:** {money.get('model', 'Not supplied')}\n"
        f"- **Pricing hypothesis:** {money.get('pricing_hypothesis', 'Not supplied')}\n- **Free tier:** {money.get('free_tier', 'Not supplied')}\n"
        f"- **Free hosting:** {data.get('free_hosting', 'Not supplied')}\n\n## Potential operating costs\n\n{markdown_list(data.get('operating_costs'))}\n"
        f"\n## Potential customers\n\n{markdown_list(data.get('potential_customers'))}\n\n## Launch strategy\n\n{markdown_list(data.get('launch_strategy'))}\n"
        f"\n## Draft marketing copy\n\n**Tagline:** {marketing.get('tagline', '')}\n\n{marketing.get('social_post', '')}\n\n"
        "> This is a hypothesis, not an earnings claim. Outreach and transactions require Raj's authorization.\n",
        encoding="utf-8",
    )
    return daily, revenue


def update_catalog_and_ledger(data: dict[str, Any], project_dir: Path, mission: str, today: str) -> None:
    relative = project_dir.relative_to(ROOT).as_posix()
    catalog = ROOT / "CATALOG.md"
    if not catalog.exists():
        catalog.write_text("# Product catalog\n\n", encoding="utf-8")
    with catalog.open("a", encoding="utf-8") as handle:
        handle.write(f"- **{today} · {mission} · [{data['project_name']}]({relative})** — {data['problem']}\n")
    ledger = ROOT / "reports" / "startup-ledger.csv"
    ledger.parent.mkdir(parents=True, exist_ok=True)
    new = not ledger.exists() or ledger.stat().st_size == 0
    money = data.get("monetization", {}) if isinstance(data.get("monetization"), dict) else {}
    with ledger.open("a", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        if new:
            writer.writerow(["ist_date", "mission", "project_name", "problem", "target_customers", "monetization_model", "project_folder", "verified_revenue_inr"])
        writer.writerow([today, mission, data["project_name"], data["problem"], "; ".join(map(str, data.get("target_customers", []))), money.get("model", ""), relative, "0"])


def write_outputs(data: dict[str, Any], project_dir: Path, report: Path, mission: str) -> None:
    summary = {"project_name": data["project_name"], "mission": mission, "project_dir": project_dir.relative_to(ROOT).as_posix(), "report_path": report.relative_to(ROOT).as_posix(), "problem": data["problem"], "features": data.get("features", []), "monetization": data.get("monetization", {})}
    (ROOT / ".amala-summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as handle:
            for key in ("project_name", "project_dir", "report_path"):
                handle.write(f"{key}={summary[key]}\n")


def main() -> int:
    args = parse_args()
    today = mission_date(args.date)
    report = ROOT / "reports" / "daily-reports" / f"{today}-{args.mission}.md"
    if report.exists():
        raise FactoryError(f"The {args.mission} mission for {today} already exists; refusing a duplicate streak commit")
    data = dry_run_response(args.mission) if args.dry_run else provider_response(args.mission, today)
    if not isinstance(data, dict):
        raise FactoryError("Generated response is not a JSON object")
    validate_payload(data)
    data["slug"] = safe_slug(data["slug"])
    project_dir = write_project(data, args.mission, today)
    daily_report, _ = write_reports(data, project_dir, args.mission, today)
    update_catalog_and_ledger(data, project_dir, args.mission, today)
    write_outputs(data, project_dir, daily_report, args.mission)
    print(f"Generated {data['project_name']} in {project_dir.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except FactoryError as exc:
        print(f"Factory error: {exc}", file=sys.stderr)
        raise SystemExit(1)

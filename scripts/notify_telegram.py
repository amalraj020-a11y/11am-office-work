#!/usr/bin/env python3
"""Send a concise, honest workflow result to Telegram when configured."""

from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat_id:
        print("Telegram secrets are not configured; notification skipped.")
        return 0
    summary_path = ROOT / ".amala-summary.json"
    summary = json.loads(summary_path.read_text(encoding="utf-8")) if summary_path.exists() else {}
    build = os.environ.get("BUILD_RESULT", "unknown")
    deploy = os.environ.get("DEPLOY_RESULT", "unknown")
    project = summary.get("project_name") or os.environ.get("PROJECT_NAME") or "No completed project"
    mission = summary.get("mission") or os.environ.get("MISSION") or "unknown"
    deployment = os.environ.get("PAGES_URL") if deploy == "success" else "Not deployed or not verified"
    message = (
        f"Amala Daily Startup Factory\n\nMission: {mission}\nProject: {project}\n"
        f"Build: {build}\nDeployment: {deploy}\nVerified URL: {deployment}\n"
        f"Repository: https://github.com/{os.environ.get('REPOSITORY', '')}\n"
        f"Run details: {os.environ.get('RUN_URL', '')}\n\n"
        "Revenue is not guaranteed. Review the product and reports before customer use."
    )
    data = urllib.parse.urlencode({"chat_id": chat_id, "text": message, "disable_web_page_preview": "true"}).encode("utf-8")
    request = urllib.request.Request(f"https://api.telegram.org/bot{token}/sendMessage", data=data, method="POST")
    with urllib.request.urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"Telegram returned HTTP {response.status}")
    print("Telegram notification sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

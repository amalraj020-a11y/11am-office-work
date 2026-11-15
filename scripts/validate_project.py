#!/usr/bin/env python3
"""Perform deterministic safety and quality checks on a generated static product."""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path


class ProductParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.has_title = False
        self.has_viewport = False
        self.has_main = False
        self.remote_scripts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "title":
            self.has_title = True
        if tag == "main":
            self.has_main = True
        if tag == "meta" and values.get("name", "").lower() == "viewport":
            self.has_viewport = True
        if tag == "script" and (values.get("src") or "").startswith(("http://", "https://", "//")):
            self.remote_scripts.append(values["src"] or "")


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_project.py PROJECT_DIR", file=sys.stderr)
        return 2
    project = Path(sys.argv[1]).resolve()
    errors: list[str] = []
    if not project.is_dir():
        errors.append(f"Not a project directory: {project}")
    else:
        for name in ("index.html", "README.md", "project.json"):
            path = project / name
            if not path.is_file() or path.stat().st_size == 0:
                errors.append(f"Missing or empty required file: {name}")
    if not errors:
        html = (project / "index.html").read_text(encoding="utf-8")
        parser = ProductParser()
        parser.feed(html)
        if not parser.has_title:
            errors.append("index.html has no title")
        if not parser.has_viewport:
            errors.append("index.html has no responsive viewport meta tag")
        if not parser.has_main:
            errors.append("index.html has no main landmark")
        if parser.remote_scripts:
            errors.append("Remote executable scripts are forbidden: " + ", ".join(parser.remote_scripts))
        if re.search(r"(?:api[_-]?key|secret|password)\s*[:=]\s*['\"][^'\"]{8,}", html, re.I):
            errors.append("index.html may contain a hard-coded credential")
        if len((project / "README.md").read_text(encoding="utf-8")) < 120:
            errors.append("README.md is too short")
        css_files = list(project.rglob("*.css"))
        js_files = list(project.rglob("*.js"))
        if not css_files:
            errors.append("Project has no CSS file")
        elif any(path.stat().st_size < 80 for path in css_files):
            errors.append("Every CSS file must contain meaningful styling")
        if not js_files:
            errors.append("Project has no JavaScript file")
        elif any(path.stat().st_size < 80 for path in js_files):
            errors.append("Every JavaScript file must contain meaningful functionality")
        elif shutil.which("node"):
            for path in js_files:
                result = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True, check=False)
                if result.returncode:
                    errors.append(f"JavaScript syntax failed for {path.name}: {result.stderr.strip()}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Validated {project}: responsive markup, docs, assets, and basic safety checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""
LGPD PII Scanner — scans files for personal data patterns.

Usage:
    python pii_scan.py [path]           # scan a directory or file
    python pii_scan.py . --summary      # print only the summary table
    python pii_scan.py . > results.txt  # save for generate_report.py

Pipe to generate_report.py:
    python pii_scan.py . 2>&1 | python generate_report.py --project MyApp
"""

import re
import sys
import argparse
from pathlib import Path
from collections import defaultdict

PATTERNS = {
    "CPF":         (r"\d{3}\.\d{3}\.\d{3}-\d{2}", "HIGH"),
    "RG":          (r"\b\d{1,2}\.\d{3}\.\d{3}-[0-9Xx]\b", "HIGH"),
    "CNPJ":        (r"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}", "MEDIUM"),
    "EMAIL":       (r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", "MEDIUM"),
    "PHONE":       (r"\(?\d{2}\)?\s?9?\d{4}-?\d{4}", "MEDIUM"),
    "CEP":         (r"\b\d{5}-\d{3}\b", "LOW"),
    "JWT":         (r"eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+", "CRITICAL"),
    "CREDIT_CARD": (r"\b(?:\d[ -]?){13,16}\b", "CRITICAL"),
    "API_KEY":     (r"(?i)(?:api[_-]?key|secret|token)\s*[:=]\s*['\"]?[A-Za-z0-9\-_]{16,}", "CRITICAL"),
}

SKIP_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".pdf", ".zip", ".tar", ".gz", ".lock",
    ".pyc", ".pyo", ".class", ".so", ".dll", ".exe",
}

SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv",
    "dist", "build", ".next", "coverage",
    # tool-generated agent output — not user code
    ".claude", ".cursor", ".opencode",
}

SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


def mask(value: str, pii_type: str) -> str:
    if pii_type == "CPF":
        return f"***.***.***-{value[-2:]}" if len(value) >= 2 else "***"
    if pii_type == "EMAIL":
        parts = value.split("@")
        return f"{parts[0][0]}***@{parts[1]}" if len(parts) == 2 else "***"
    if pii_type in ("JWT", "API_KEY"):
        return value[:10] + "..." + value[-4:]
    if pii_type == "CREDIT_CARD":
        digits = re.sub(r"\D", "", value)
        return f"****-****-****-{digits[-4:]}" if len(digits) >= 4 else "****"
    return value[:4] + "***"


def should_skip(path: Path) -> bool:
    if path.suffix.lower() in SKIP_EXTENSIONS:
        return True
    return any(part in SKIP_DIRS for part in path.parts)


def scan_file(file_path: Path, summary: dict):
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return

    for name, (pattern, severity) in PATTERNS.items():
        matches = re.findall(pattern, content)
        if matches:
            print(f"[{name} DETECTED] {file_path}")
            for match in matches:
                print(f"  -> {mask(match, name)}")
            summary[severity] += len(matches)
            summary["files"].add(str(file_path))


def scan_path(target: Path, summary: dict):
    if target.is_file():
        if not should_skip(target):
            scan_file(target, summary)
    elif target.is_dir():
        for file in sorted(target.rglob("*")):
            if file.is_file() and not should_skip(file):
                scan_file(file, summary)
    else:
        print(f"[ERROR] Path not found: {target}", file=sys.stderr)


def print_summary(summary: dict):
    total = sum(summary[s] for s in SEVERITY_ORDER)
    print("\n" + "=" * 60)
    print("LGPD PII Scan Summary")
    print("=" * 60)
    print(f"  Files with findings : {len(summary['files'])}")
    print(f"  Total matches       : {total}")
    for sev in SEVERITY_ORDER:
        count = summary[sev]
        if count:
            print(f"  {sev:<12}: {count} match(es)")

    if total == 0:
        rating = "Compliant"
    elif summary["CRITICAL"] > 0:
        rating = "Non-Compliant"
    elif summary["HIGH"] > 0:
        rating = "At Risk"
    else:
        rating = "Needs Improvement"

    print(f"\n  Compliance rating   : {rating}")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="LGPD PII file scanner")
    parser.add_argument("path", nargs="?", default=".", help="File or directory to scan (default: current dir)")
    parser.add_argument("--summary", action="store_true", help="Print only the summary table")
    args = parser.parse_args()

    summary = defaultdict(int)
    summary["files"] = set()

    if args.summary:
        sys.stdout = open(sys.stderr.fileno(), "w", closefd=False)

    scan_path(Path(args.path), summary)
    print_summary(summary)


if __name__ == "__main__":
    main()

"""
Reads PII scan output (from pii_scan.py) and generates a structured
LGPD compliance report in Markdown.

Usage:
    python pii_scan.py 2>&1 | python generate_report.py
    python generate_report.py --input scan_results.txt --output report.md
"""

import sys
import re
import argparse
from datetime import datetime, timezone
from collections import defaultdict
from pathlib import Path

SEVERITY_MAP = {
    "JWT": "CRITICAL",
    "CPF": "HIGH",
    "RG": "HIGH",
    "CREDIT_CARD": "HIGH",
    "CNPJ": "MEDIUM",
    "EMAIL": "MEDIUM",
    "PHONE": "MEDIUM",
    "CEP": "LOW",
}

SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}

RECOMMENDATIONS = {
    "JWT": "Revoke immediately. Never log tokens. Use opaque session IDs in logs.",
    "CPF": "Apply column-level encryption. Mask in logs: `***.***.***-XX`. Restrict API exposure.",
    "RG": "Apply column-level encryption. Mask in logs. Minimize collection if CPF suffices.",
    "CREDIT_CARD": "Remove from codebase immediately. Use PCI-compliant tokenization (e.g., Stripe token).",
    "EMAIL": "Mask in logs: `u***@domain.com`. Store hashed for lookup where possible.",
    "PHONE": "Mask in logs: `(**) *****-XXXX`. Do not include in URL parameters.",
    "CNPJ": "Treat as personal data for individual entrepreneurs. Mask in logs.",
    "CEP": "Avoid logging. Consider storing only state/region when full address is not required.",
}


def parse_scan_line(line: str):
    match = re.match(r"\[(\w+) DETECTED\] (.+)", line.strip())
    if match:
        return match.group(1), match.group(2)
    return None, None


def parse_input(lines):
    findings = []
    current_type = None
    current_file = None
    for line in lines:
        pii_type, file_path = parse_scan_line(line)
        if pii_type:
            current_type = pii_type
            current_file = file_path
        elif line.strip().startswith("->") and current_type:
            findings.append({
                "type": current_type,
                "file": current_file,
                "severity": SEVERITY_MAP.get(current_type, "MEDIUM"),
            })
    return findings


def compliance_rating(findings):
    if not findings:
        return "Compliant"
    severities = {f["severity"] for f in findings}
    if "CRITICAL" in severities:
        return "Non-Compliant"
    if "HIGH" in severities:
        return "At Risk"
    if "MEDIUM" in severities:
        return "Needs Improvement"
    return "Needs Improvement"


def generate_report(findings, project_name="Project"):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    rating = compliance_rating(findings)

    by_severity = defaultdict(list)
    for f in findings:
        by_severity[f["severity"]].append(f)

    lines = [
        f"# LGPD Compliance Report\n",
        f"## Summary\n",
        f"- **Project:** {project_name}",
        f"- **Date:** {now}",
        f"- **Total findings:** {len(findings)}",
        f"- **Compliance rating:** {rating}\n",
        "---\n",
        "## Findings\n",
        "| Severity | Type | File | Recommendation |",
        "|---|---|---|---|",
    ]

    sorted_findings = sorted(findings, key=lambda f: SEVERITY_ORDER.get(f["severity"], 9))
    for f in sorted_findings:
        rec = RECOMMENDATIONS.get(f["type"], "Review and apply appropriate masking or encryption.")
        lines.append(f"| {f['severity']} | {f['type']} | `{f['file']}` | {rec} |")

    lines += [
        "\n---\n",
        "## Findings by Severity\n",
    ]
    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
        count = len(by_severity[sev])
        if count:
            lines.append(f"- **{sev}**: {count} finding(s)")

    lines += [
        "\n---\n",
        "## Recommendations\n",
        "1. Address all CRITICAL findings immediately — revoke exposed credentials and tokens",
        "2. Encrypt or pseudonymize all HIGH-severity fields (CPF, RG, credit card)",
        "3. Apply log masking middleware to prevent PII leaking into logs",
        "4. Review API responses to ensure data minimization",
        "5. Implement automated retention enforcement for personal data tables",
        "6. Schedule quarterly LGPD audits to catch regressions\n",
    ]

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Generate LGPD compliance report from PII scan output")
    parser.add_argument("--input", "-i", help="Input file (default: stdin)")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument("--project", "-p", default="Project", help="Project name for the report")
    args = parser.parse_args()

    if args.input:
        lines = Path(args.input).read_text(encoding="utf-8").splitlines()
    else:
        lines = sys.stdin.read().splitlines()

    findings = parse_input(lines)
    report = generate_report(findings, project_name=args.project)

    if args.output:
        Path(args.output).write_text(report, encoding="utf-8")
        print(f"Report written to {args.output}")
    else:
        print(report)


if __name__ == "__main__":
    main()

Perform a full LGPD compliance audit of this project.

## Scope

Analyze all layers of the stack:

- **Backend code** — look for PII in logs, hardcoded secrets, weak crypto, missing input validation
- **Frontend code** — check for PII stored in localStorage/sessionStorage, unmasked data in UI, insecure forms
- **API layer** — verify authentication, authorization, response minimization, HTTPS enforcement, security headers
- **Database** — check for plaintext PII columns, missing retention policy, overprivileged accounts
- **AI/LLM integrations** — detect raw personal data in prompts, prompt injection risks, context leakage
- **Consent flows** — validate consent capture, versioning, revocation, and data subject rights endpoints
- **Test files** — flag hardcoded real-looking CPF, email, credit card, or JWT values used as fixtures

## Output format

### 1. Risk Classification

List every finding as:
```
[SEVERITY] Type — file:line
Risk: what the problem is
Fix: specific remediation step
LGPD: relevant article or principle
```

### 2. Affected Files

Table of files with findings, sorted by severity.

### 3. Recommended Fixes (prioritized)

Numbered list, most critical first.

### 4. Compliance Score

Score from 0–100 based on:
- 0 CRITICAL findings: +40 pts
- 0 HIGH findings: +30 pts
- 0 MEDIUM findings: +20 pts
- 0 LOW findings: +10 pts
Deduct proportionally per finding above zero.

### 5. Executive Summary

3–5 sentences suitable for a non-technical stakeholder. State the overall risk level and the single most important action to take.
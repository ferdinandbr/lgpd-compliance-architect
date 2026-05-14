Review the code in this file (or the specified path) for personal data exposure risks under the Brazilian LGPD.

Check for:

1. **Log statements** — any `console.log`, `print`, `logger.*`, `winston`, `pino`, or `structlog` call that includes user objects, request bodies, or fields like cpf, email, phone, name, address, rg, token, password, or card
2. **API responses** — endpoints that return more personal data fields than the consumer actually needs; flag `SELECT *` patterns mapped to responses
3. **Database queries** — raw PII stored in plaintext columns; no retention/expiry columns on personal data tables
4. **Test files** — hardcoded CPF, email, credit card, JWT, or real-looking personal data used as test fixtures (use anonymized or clearly fake values)
5. **Error handling** — stack traces, raw exceptions, or personal data returned in HTTP error responses
6. **URL parameters** — personal data passed via query string or route parameter (e.g., `/users/{cpf}` or `/users?cpf=...`)
7. **Comments and docstrings** — real personal data used as examples in code comments

For each finding, report:

- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Location**: file path and line number
- **Type**: what kind of personal data or risk
- **Recommendation**: the specific fix (mask, encrypt, remove, replace with UUID, etc.)

At the end, provide a summary count per severity and an overall compliance rating:
- **Compliant** — no findings
- **Needs Improvement** — only LOW/MEDIUM findings
- **At Risk** — one or more HIGH findings
- **Non-Compliant** — one or more CRITICAL findings

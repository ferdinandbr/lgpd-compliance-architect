# Audit Trail

Ensure all access and processing of personal data produces an immutable, queryable audit record.

## What Must Be Logged

- Who accessed or modified personal data (user ID, service account)
- What data category was accessed or changed (not raw values)
- When the event occurred (UTC timestamp, ISO 8601)
- From where (IP address, service name, request ID)
- The legal basis that authorized the processing (consent ID, legitimate interest, contract)
- Data subject rights requests: access, correction, deletion, portability, objection

## Audit Log Requirements

- Logs must be append-only and tamper-evident (no UPDATE/DELETE allowed)
- Retention: minimum 5 years for financial data, 2 years for general personal data
- Separate storage from application logs with stricter access controls
- Structured format (JSON preferred) for queryability
- Include correlation/trace IDs linking audit events to application logs

## What Must NOT Appear in Audit Logs

- Raw personal data values (CPF, email, credit card numbers)
- Passwords, tokens, or secrets
- Full request/response bodies containing PII

## Review Checklist

- [ ] All database queries touching personal data tables are instrumented
- [ ] All API endpoints returning personal data emit audit events
- [ ] Data subject rights requests create a complete audit trail
- [ ] Audit logs have separate access controls from application logs
- [ ] Retention policy is enforced automatically (not manually)
- [ ] Audit log integrity is verifiable (hash chain or WORM storage)

# API Security

Review all API endpoints for LGPD compliance and security vulnerabilities.

## Detection

- Personal data exposed in URL parameters (CPF, email, ID)
- Missing authentication or authorization on endpoints that return personal data
- Overly verbose responses returning unnecessary PII fields
- Missing rate limiting on endpoints that enumerate user data
- HTTP (non-HTTPS) endpoints transmitting personal data
- Unmasked sensitive data in API error responses
- Missing input validation allowing injection attacks
- CORS misconfigurations exposing data to untrusted origins

## Required Controls

- Authentication: all personal data endpoints must require valid JWT/session
- Authorization: verify ownership before returning user-specific data
- HTTPS only: reject or redirect HTTP connections
- Response minimization: return only fields required by the consumer
- Rate limiting: apply on authentication and data-access endpoints
- Input validation: sanitize and validate all incoming parameters
- Error handling: never include stack traces or raw data in error responses

## Prohibited Patterns

- Personal data in query strings (`GET /users?cpf={cpf}`)
- Unauthenticated endpoints returning personal data
- `SELECT *` mapped directly to API response without field filtering
- Secrets, tokens, or internal IDs exposed in response bodies
- Logging full request bodies that may contain PII

## Recommended Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Cache-Control: no-store  (on all endpoints returning personal data)
```

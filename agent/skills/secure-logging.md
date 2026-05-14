# Secure Logging

Prevent accidental exposure of personal data through application, error, and debug logs.

## Fundamental Rules

- Logs must never contain raw personal data (CPF, RG, email, phone, credit card, health data)
- Secrets, tokens, passwords, and API keys must never appear in any log output
- Use opaque identifiers (user UUID, request ID) instead of personal data fields
- Log the event and its classification — not the data content itself

## Prohibited Log Patterns

```python
# FORBIDDEN
logger.info(f"User login: {user.cpf}")
logger.debug(f"Request body: {request.body}")
logger.error(f"Payment failed for card {card_number}")
print(f"JWT: {token}")
console.log(user)  # dumps entire user object including PII
```

## Correct Patterns

```python
# CORRECT
logger.info("User login", extra={"user_id": user.id, "event": "login"})
logger.debug("Request received", extra={"request_id": request.id, "path": request.path})
logger.error("Payment failed", extra={"user_id": user.id, "error_code": "CARD_DECLINED"})
```

## Log Levels in Production

| Level | Production Use |
|---|---|
| ERROR | Unexpected failures requiring attention |
| WARNING | Recoverable issues, degraded behavior |
| INFO | Key business events (login, consent granted, data export) |
| DEBUG | **Disabled in production** |

## Masking Utilities

```python
def mask_cpf(cpf: str) -> str:
    return f"***.***.***-{cpf[-2:]}" if cpf and len(cpf) >= 2 else "***"

def mask_email(email: str) -> str:
    parts = email.split("@")
    return f"{parts[0][0]}***@{parts[1]}" if len(parts) == 2 else "***"
```

## Structured Log Format

```json
{
  "timestamp": "2026-05-14T12:00:00Z",
  "level": "INFO",
  "service": "user-service",
  "request_id": "req-abc123",
  "user_id": "usr-xyz789",
  "event": "consent_granted",
  "purpose": "marketing"
}
```

## Review Checklist

- [ ] No `console.log`, `print`, or `logger.debug` with user objects in production paths
- [ ] All log statements reviewed for PII presence
- [ ] DEBUG log level disabled in production configuration
- [ ] Log aggregation platform has access controls (not open to all engineers)
- [ ] Log retention policy configured (application logs: 90 days default)
- [ ] Authorization and Cookie headers stripped from access logs

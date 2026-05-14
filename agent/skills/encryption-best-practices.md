# Encryption Best Practices

Ensure data is protected in transit and at rest using current cryptographic standards.

## Data in Transit

- **TLS 1.2 minimum**, TLS 1.3 preferred — disable TLS 1.0 and 1.1
- Validate server certificates — no `verify=False` or `NODE_TLS_REJECT_UNAUTHORIZED=0` in production
- Use HSTS (`Strict-Transport-Security`) with a long max-age
- Prefer ECDHE cipher suites for forward secrecy

## Data at Rest

- **AES-256-GCM** for symmetric encryption of stored personal data
- Never use ECB mode — it leaks patterns in ciphertext
- Unique IV/nonce per encryption operation — never reuse
- Store IV alongside ciphertext, key separately in a secret manager

## Password Storage

- **bcrypt** (cost >= 12), **argon2id**, or **scrypt** — no other algorithms acceptable
- Never store passwords with MD5, SHA-1, SHA-256, or any reversible encoding
- Always use a per-user random salt (built into bcrypt/argon2)

## Key Management

- Keys stored in dedicated secret managers (AWS KMS, HashiCorp Vault, Azure Key Vault)
- No hardcoded keys in source code, config files, or environment variables committed to version control
- Key rotation schedule: at minimum annually, immediately upon suspected compromise
- Separate encryption keys per data classification (PII key != payment key != auth key)

## Prohibited Patterns

```python
# FORBIDDEN — weak hash for passwords
hashlib.md5(password.encode()).hexdigest()
hashlib.sha1(password.encode()).hexdigest()

# FORBIDDEN — hardcoded key
SECRET_KEY = "abc123hardcoded"

# FORBIDDEN — disabled TLS verification
requests.get(url, verify=False)

# FORBIDDEN — ECB mode
AES.new(key, AES.MODE_ECB)
```

## Review Checklist

- [ ] No MD5/SHA-1 used for password storage
- [ ] TLS certificate validation enabled in all HTTP clients
- [ ] No hardcoded secrets in any file tracked by git
- [ ] Encryption keys sourced from secret manager at runtime
- [ ] All personal data columns encrypted at rest
- [ ] IV/nonce unique per encryption call

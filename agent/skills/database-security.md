# Database Security

Ensure databases storing personal data comply with LGPD requirements for protection, access control, and retention.

## Encryption

- **At rest**: AES-256 or database-native encryption (TDE) for all tables containing personal data
- **Column-level encryption**: mandatory for CPF, RG, health data, biometrics, financial data
- **Backups**: encrypted with a separate key from the live database
- **Key management**: keys stored in a dedicated secret manager — never in source code or env files

## Access Control

- Principle of least privilege: application accounts have only SELECT/INSERT/UPDATE on required tables
- No application account should have DROP, TRUNCATE, or schema-altering privileges
- Separate read and write credentials where possible
- DBA access should require multi-factor authentication
- All privileged access logged to an immutable audit table

## Schema Design for Privacy

- Avoid storing raw PII in columns used as indexes or foreign keys — use an opaque UUID instead
- Separate PII into a dedicated table or schema with stricter access controls
- Add `created_at`, `updated_at`, and `deleted_at` (soft delete) to all personal data tables
- Add `retention_expires_at` to enforce automatic purging

## Prohibited Patterns

- Plaintext CPF, RG, credit card, or health data in any column
- `SELECT *` in application queries — enumerate only needed columns
- Personal data in database names, table names, or column comments
- Hardcoded credentials in migration scripts or ORM configuration
- No retention policy (data kept indefinitely)

## Retention Enforcement Example

```sql
UPDATE users
SET cpf = NULL, email = NULL, phone = NULL, anonymized_at = NOW()
WHERE retention_expires_at < NOW()
  AND anonymized_at IS NULL;
```

## Review Checklist

- [ ] All PII columns are encrypted or pseudonymized
- [ ] Application DB user has no DDL privileges
- [ ] Backup encryption verified independently
- [ ] Retention policy implemented and tested
- [ ] No PII appears in database error messages or slow query logs
- [ ] Database audit logging enabled for all personal data tables

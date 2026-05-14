# Consent Management

Validate that all personal data processing rests on a valid legal basis, and that consent is properly collected, stored, and revocable.

## LGPD Legal Bases (Art. 7 and Art. 11)

Not all processing requires consent. Valid bases include:
- **Consent** — explicit, informed, specific, and freely given
- **Contract performance** — data strictly necessary to fulfill a contract
- **Legal obligation** — required by law
- **Legitimate interest** — balanced against the data subject's rights

Always identify and document which basis applies to each processing activity.

## Consent Requirements

- Must be explicit and granular (marketing != analytics != profiling)
- Must be as easy to withdraw as to give
- Must be versioned — store which policy version was accepted
- Must record the timestamp and channel (web form, mobile, API)
- Must not be bundled with terms of service acceptance
- For sensitive data (health, biometric, racial, religious): consent is mandatory

## Implementation Checklist

- [ ] Consent captured before processing begins — not inferred
- [ ] Consent stored with: user ID, version, purpose, timestamp, IP/device
- [ ] Revocation endpoint exists and is tested
- [ ] After revocation: processing stops and data is flagged for deletion/anonymization
- [ ] Consent version is checked before each processing cycle
- [ ] Minors (under 18): parental or guardian consent required
- [ ] Consent logs retained for the duration of the relationship plus 5 years

## Prohibited Patterns

- Pre-ticked consent checkboxes
- Conditional access ("accept or you cannot use the service") for non-essential processing
- Consent collected via obscure or buried language
- No mechanism to revoke consent
- Processing continuing after revocation

## Data Subject Rights to Implement (Art. 18)

| Right | Endpoint Required |
|---|---|
| Access | `GET /me/data` — return all stored personal data |
| Correction | `PATCH /me/data` — update inaccurate data |
| Deletion | `DELETE /me/data` — erase when no legal basis remains |
| Portability | `GET /me/data/export` — structured, machine-readable format |
| Objection | `POST /me/consent/revoke` — stop specific processing |
| Information | Privacy policy listing all processing activities |

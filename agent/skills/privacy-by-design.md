# Privacy by Design

Apply privacy proactively — before a feature is built, not after a breach occurs.
Based on Ann Cavoukian's 7 principles and LGPD Art. 46.

## The 7 Principles

1. **Proactive, not reactive** — anticipate privacy risks before they materialize
2. **Privacy as the default** — protection is automatic; the user should not have to act to preserve it
3. **Privacy embedded into design** — not bolted on afterward
4. **Full functionality** — privacy and functionality are not trade-offs
5. **End-to-end security** — data protected throughout its entire lifecycle
6. **Visibility and transparency** — processing is visible and verifiable
7. **Respect for user privacy** — keep it user-centric

## Data Minimization Checklist

Before collecting any field, ask:
- Is this field strictly necessary for the stated purpose?
- Can the purpose be achieved with a less sensitive field?
- Is there a way to achieve the goal without collecting personal data at all?

If the answer is "no" or "maybe" to any question, do not collect it.

## Purpose Limitation

- Each personal data field must have a documented, specific purpose
- Data collected for purpose A must not be used for purpose B without new consent
- Flag any code that reuses personal data outside its original collection context

## Storage Limitation by Data Category

| Data Category | Maximum Retention |
|---|---|
| Session tokens | Session lifetime only |
| Authentication logs | 90 days |
| Transaction data | 5 years (legal obligation) |
| Marketing data | Until consent revoked |
| Health data | As required by health regulations |
| Biometric data | Until purpose fulfilled or consent revoked |

## Privacy Impact Assessment Triggers

Perform a PIA when:
- Introducing a new type of personal data collection
- Building a profiling or scoring system
- Integrating an AI/ML model that processes personal data
- Sharing personal data with a third party
- Changing the purpose for which data is processed

## Review Checklist

- [ ] No field is collected "just in case" — every field has a documented purpose
- [ ] Default settings minimize data sharing (opt-in, not opt-out)
- [ ] Data flow diagram exists and is current
- [ ] Third-party data sharing is documented and contractually protected (DPA in place)
- [ ] Anonymization applied when the original data is no longer needed
- [ ] Pseudonymization applied when re-identification is still necessary for operations

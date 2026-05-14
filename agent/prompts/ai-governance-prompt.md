Review all AI and LLM integrations in this project for LGPD compliance and security risks.

## Detection Checklist

**Prompt construction:**
- [ ] Raw CPF, RG, email, health data, or financial data sent directly in prompts
- [ ] User input passed to LLM without sanitization (prompt injection risk)
- [ ] System prompts containing hardcoded personal data as examples

**Memory and context:**
- [ ] Conversation history persisted with unmasked personal data
- [ ] Long-term memory stores containing personal data without a retention policy
- [ ] Cross-user context leakage (one user's data appearing in another's session)

**Embeddings and vector databases:**
- [ ] Personal data embedded directly into vector representations
- [ ] No access control on vector DB — any query can retrieve any user's embeddings
- [ ] No retention or deletion mechanism for user-specific embeddings

**Third-party risks:**
- [ ] Personal data sent to third-party LLM providers (OpenAI, Anthropic, etc.) without a DPA in place
- [ ] Model training opt-out not verified with the provider
- [ ] No logging of what data was sent to external AI services

**Output handling:**
- [ ] LLM output returned to users without filtering for inadvertent PII disclosure
- [ ] Model outputs stored in logs without masking

## Recommendations

For each finding, provide:
1. The specific risk (data type, location, severity)
2. The fix (mask before sending, add retention policy, implement access control, etc.)
3. The LGPD article or principle violated

## Required Controls

- PII masking layer between application data and LLM prompt construction
- Data Processing Agreement (DPA) with every third-party AI provider
- Audit log of all external AI API calls (timestamp, service, data category sent — not raw values)
- Retention policy for all AI-generated content and conversation history
- Prompt injection mitigation (input validation, output filtering, sandboxing)
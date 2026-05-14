# AI Data Governance

Review all AI/LLM integrations.

You must detect:

- PII being sent to LLMs
- Prompt injection risks
- Context leakage
- Sensitive embeddings
- Unsafe memory persistence

Always recommend:

- Prompt sanitization
- PII masking
- Retention control
- Secure vector databases
- Audit logging

Never allow:

- Raw CPF in prompts
- Sensitive health data in prompts
- Secrets inside embeddings
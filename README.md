<p align="center">
  <img src="logo.png" alt="LGPD Compliance Architect Logo" width="200">
</p>

<h1 align="center">LGPD Compliance Architect</h1>


Agente de IA especializado em conformidade com a **Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)**. Detecta exposição de dados pessoais, aplica Privacy by Design e audita backend, frontend, APIs, bancos de dados e integrações com IA.

Instalável via `npx` no **Claude Code**, **Cursor**, **Windsurf**, **VS Code Copilot** e **Cline**.

---

## Instalação rápida

```bash
npx lgpd-compliance-architect
```

O instalador interativo pergunta o escopo e as ferramentas desejadas:

```
┌  LGPD Compliance Architect  v1.0.0

Etapa 1 de 3 — Escopo de instalação
◆  Onde instalar o agente?
│  ● Este projeto         instala somente no diretório atual
│  ○ Todos os projetos    Claude Code → ~/.claude/agents

Etapa 2 de 3 — Ferramentas de IA
◆  Quais ferramentas instalar?
│  ◼ Claude Code
│  ◼ Cursor
│  ◻ Windsurf
│  ◻ VS Code Copilot
│  ◻ Cline

Etapa 3 de 3 — Confirmação
◇  Resumo
│  Escopo:      local (este projeto)
│  Ferramentas: Claude Code, Cursor
│  → .claude/agents/lgpd-compliance-architect.md
│  → .cursor/rules/lgpd-compliance.mdc

└  Agente LGPD instalado com sucesso! Bons audits.
```

### Instalação não-interativa

```bash
# Instalar globalmente no Claude Code + Cursor
npx lgpd-compliance-architect --scope global --tools claude,cursor --yes

# Ver todas as opções
npx lgpd-compliance-architect --list
```

---

## Ferramentas suportadas

| Flag | Ferramenta | Arquivo gerado (projeto) | Arquivo gerado (global) |
|---|---|---|---|
| `claude` | Claude Code | `.claude/agents/lgpd-compliance-architect.md` | `~/.claude/agents/lgpd-compliance-architect.md` |
| `opencode` | OpenCode | `.opencode/agents/lgpd-compliance-architect.md` | `~/.config/opencode/agents/lgpd-compliance-architect.md` |
| `cursor` | Cursor | `.cursor/rules/lgpd-compliance.mdc` | — |
| `windsurf` | Windsurf | `.windsurfrules` | — |
| `vscode` | VS Code Copilot | `.github/copilot-instructions.md` | — |
| `cline` | Cline | `.clinerules` | — |

**Escopo `global`:** Claude Code e OpenCode suportam instalação global (disponível em todos os projetos). As demais ferramentas não possuem local global equivalente e sempre instalam no diretório atual.

---

## O que o agente faz

O agente LGPD Compliance Architect analisa o código do projeto e:

- **Detecta dados pessoais expostos** — CPF, RG, e-mail, telefone, cartão de crédito, JWT, chaves de API em logs, respostas de API, queries e arquivos de teste
- **Audita segurança de APIs** — autenticação, autorização, minimização de resposta, headers de segurança, rate limiting
- **Revisa bancos de dados** — criptografia de colunas com DCP, política de retenção, controle de acesso
- **Avalia integrações de IA/LLM** — PII em prompts, prompt injection, vazamento de contexto, embeddings sensíveis
- **Valida fluxos de consentimento** — base legal, granularidade, versionamento, revogação, direitos dos titulares (Art. 18)
- **Aplica Privacy by Design** — minimização de dados, limitação de finalidade, relatório de impacto (RIPD)
- **Classifica riscos** — CRITICAL / HIGH / MEDIUM / LOW com recomendações específicas e referência ao artigo da LGPD

### Classificação de severidade

| Severidade | Definição | Exemplo |
|---|---|---|
| **CRITICAL** | Risco imediato de vazamento | JWT em código, senha hardcoded, cartão em plaintext |
| **HIGH** | Dado pessoal exposto sem proteção | CPF em log, coluna não criptografada, endpoint sem auth |
| **MEDIUM** | Risco de privacidade explorável | E-mail em erro, resposta de API verbosa |
| **LOW** | Gap menor de conformidade | CEP logado, header `Cache-Control` ausente |

---

## Prompts prontos para uso

Após a instalação, use os prompts em `agent/prompts/`:

### Auditoria completa do projeto
Cole o conteúdo de `agent/prompts/audit-prompt.md` no chat com o agente. Ele analisará backend, frontend, APIs, banco de dados e integrações de IA, e produzirá:
- Classificação de riscos por severidade
- Arquivos afetados
- Fixes recomendados priorizados
- Score de conformidade (0–100)
- Resumo executivo

### Revisão de PII em um arquivo
Cole o conteúdo de `agent/prompts/pii-review-prompt.md` + o arquivo a ser revisado. Detecta dados pessoais em logs, respostas de API, queries, testes e comentários.

### Governança de IA
Cole `agent/prompts/ai-governance-prompt.md` para revisar integrações com LLMs (OpenAI, Anthropic, etc.) quanto à exposição de DCP em prompts, embeddings e histórico de conversa.

---

## Scanner de linha de comando

```bash
# Escanear o projeto atual
python scripts/pii_scan.py .

# Gerar relatório Markdown
python scripts/pii_scan.py . | python scripts/generate_report.py --project MeuApp

# Salvar relatório em arquivo
python scripts/pii_scan.py . | python scripts/generate_report.py -p MeuApp -o relatorio.md
```

Padrões detectados pelo scanner:

| Tipo | Severidade |
|---|---|
| JWT | CRITICAL |
| Cartão de crédito | CRITICAL |
| Chave de API | CRITICAL |
| CPF | HIGH |
| RG | HIGH |
| CNPJ | MEDIUM |
| E-mail | MEDIUM |
| Telefone | MEDIUM |
| CEP | LOW |

---

## Templates legais (PT-BR)

Modelos prontos em `templates/` para adaptar à sua empresa:

| Arquivo | Descrição |
|---|---|
| `privacy-policy.md` | Política de Privacidade compliant com LGPD |
| `terms-of-use.md` | Termos de Uso |
| `cookie-policy.md` | Política de Cookies com categorias e base legal |
| `data-processing-agreement.md` | DPA (Acordo de Processamento de Dados) — exigido pela LGPD Art. 50 |
| `compliance-report.md` | Template de relatório de auditoria |
| `incident-report.md` | Relatório de incidente de dados com checklist ANPD |
| `consent-flow.md` | Fluxo e schema de consentimento |

---

## Estrutura do projeto

```
lgpd-compliance-architect/
│
├── agent/                        # Dados do agente
│   ├── agent.md                  # Configuração e system prompt
│   ├── skills/                   # 10 módulos de conhecimento
│   │   ├── lgpd-core.md
│   │   ├── pii-detection.md
│   │   ├── api-security.md
│   │   ├── database-security.md
│   │   ├── encryption-best-practices.md
│   │   ├── secure-logging.md
│   │   ├── privacy-by-design.md
│   │   ├── consent-management.md
│   │   ├── audit-trail.md
│   │   └── ai-data-governance.md
│   ├── rules/                    # Regras LGPD em YAML
│   │   ├── pii-regex.yaml        # Padrões de regex para detecção
│   │   ├── forbidden-patterns.yaml
│   │   ├── masking-rules.yaml
│   │   └── lgpd-policies.yaml
│   └── prompts/                  # Prompts de auditoria
│       ├── audit-prompt.md
│       ├── pii-review-prompt.md
│       └── ai-governance-prompt.md
│
├── templates/                    # Documentos legais (PT-BR)
├── scripts/                      # Scanner e gerador de relatório
│   ├── pii_scan.py
│   └── generate_report.py
│
├── bin/
│   └── cli.js                    # CLI do instalador (npx)
└── src/
    ├── compile.js                # Compila agent/ em um único arquivo por ferramenta
    └── installer.js              # Lógica de instalação por ferramenta
```

---

## Desenvolvimento local

```bash
# Clonar e instalar dependências
git clone <repo>
cd lgpd-compliance-architect
npm install

# Testar o instalador localmente
node bin/cli.js

# Testar flags específicas
node bin/cli.js --scope project --tools claude --yes
node bin/cli.js --list

# Verificar o que seria publicado no npm
npm pack --dry-run
```

---

## Base legal e referências

- [Lei 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [ANPD — Autoridade Nacional de Proteção de Dados](https://www.gov.br/anpd)
- [Guias da ANPD](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes)

---

## Licença

MIT

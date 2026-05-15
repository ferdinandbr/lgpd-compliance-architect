import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SKILLS = [
  'lgpd-core',
  'pii-detection',
  'privacy-by-design',
  'secure-logging',
  'api-security',
  'database-security',
  'encryption-best-practices',
  'ai-data-governance',
  'consent-management',
  'audit-trail',
];

const PROMPTS = [
  'audit-prompt',
  'pii-review-prompt',
  'ai-governance-prompt',
];

const RULES = [
  'pii-regex.yaml',
  'forbidden-patterns.yaml',
  'masking-rules.yaml',
  'lgpd-policies.yaml',
];

function safeRead(path) {
  try {
    return readFileSync(path, 'utf-8').trim();
  } catch {
    return null;
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: content.trim() };
  return { frontmatter: match[1], body: match[2].trim() };
}

export function compile(pkgRoot) {
  const agentDir = join(pkgRoot, 'agent');
  const agentMd = safeRead(join(agentDir, 'agent.md')) ?? '';
  const { body: agentBody } = parseFrontmatter(agentMd);

  // --- Skills ---
  const skillsBlock = SKILLS.map((name) => {
    const content = safeRead(join(agentDir, 'skills', `${name}.md`));
    return content ?? null;
  })
    .filter(Boolean)
    .join('\n\n---\n\n');

  // --- Prompts ---
  const promptsBlock = PROMPTS.map((name) => {
    const content = safeRead(join(agentDir, 'prompts', `${name}.md`));
    if (!content) return null;
    return `### ${titleCase(name)}\n\n${content}`;
  })
    .filter(Boolean)
    .join('\n\n---\n\n');

  // --- Rules ---
  const rulesBlock = RULES.map((file) => {
    const content = safeRead(join(agentDir, 'rules', file));
    if (!content) return null;
    return `### ${file}\n\n\`\`\`yaml\n${content}\n\`\`\``;
  })
    .filter(Boolean)
    .join('\n\n');

  const fullBody = [
    agentBody,
    skillsBlock ? `---\n\n# Skills\n\n${skillsBlock}` : null,
    promptsBlock ? `---\n\n# Prompts\n\n${promptsBlock}` : null,
    rulesBlock ? `---\n\n# Rules Reference\n\n${rulesBlock}` : null,
  ]
    .filter(Boolean)
    .join('\n\n');

  return {
    // Claude Code: original frontmatter preserved, all skills embedded inline
    claudeCode: buildClaudeCode(agentMd, fullBody),

    // OpenCode: agent markdown format for .opencode/agents/
    openCode: buildOpenCode(fullBody),

    // Cursor: MDC format with alwaysApply frontmatter
    cursor: buildCursor(fullBody),

    // Antigravity (Google): skill format for .agents/skills/
    antigravity: buildAntigravity(fullBody),

    // Generic: plain markdown (Windsurf, VS Code Copilot, Cline)
    generic: `# LGPD Compliance Architect\n\n${fullBody}`,
  };
}

function buildClaudeCode(originalAgentMd, fullBody) {
  const { frontmatter } = parseFrontmatter(originalAgentMd);
  return `---\n${frontmatter}\n---\n\n${fullBody}`;
}

function buildAntigravity(fullBody) {
  return `---
name: lgpd-compliance-architect
description: Expert LGPD and privacy compliance architect for backend, frontend, APIs, AI systems, and databases. Detects PII exposure, enforces privacy-by-design and LGPD (Lei 13.709/2018) compliance.
version: 1.0.0
---

${fullBody}`;
}

function buildOpenCode(fullBody) {
  return `---
name: lgpd-compliance-architect
description: Expert LGPD and privacy compliance architect for backend, frontend, APIs, AI systems, and databases. Detects PII exposure, enforces privacy-by-design and LGPD (Lei 13.709/2018) compliance.
---

${fullBody}`;
}

function buildCursor(fullBody) {
  return `---
description: LGPD compliance architect — detects PII exposure, enforces privacy-by-design and LGPD (Lei 13.709/2018) compliance across backend, frontend, APIs, databases and AI integrations.
alwaysApply: false
---

${fullBody}`;
}

function titleCase(str) {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

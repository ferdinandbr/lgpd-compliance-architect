#!/usr/bin/env node
import {
  intro,
  outro,
  select,
  multiselect,
  confirm,
  spinner,
  note,
  cancel,
  isCancel,
  log,
} from '@clack/prompts';
import pc from 'picocolors';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { install } from '../src/installer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, '..');
const CWD = process.cwd();

const { version } = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf-8'));

const TOOLS = [
  {
    value: 'claude',
    label: 'Claude Code',
    hint: 'subagente em .claude/agents/',
  },
  {
    value: 'cursor',
    label: 'Cursor',
    hint: 'regra em .cursor/rules/',
  },
  {
    value: 'windsurf',
    label: 'Windsurf',
    hint: 'adiciona ao .windsurfrules',
  },
  {
    value: 'vscode',
    label: 'VS Code Copilot',
    hint: 'adiciona ao .github/copilot-instructions.md',
  },
  {
    value: 'cline',
    label: 'Cline',
    hint: 'adiciona ao .clinerules',
  },
  {
    value: 'opencode',
    label: 'OpenCode',
    hint: 'agente em .opencode/agents/',
  },
];

// ─── Flags ───────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--scope' || args[i] === '-s') && args[i + 1]) {
      flags.scope = args[++i];
    } else if ((args[i] === '--tools' || args[i] === '-t') && args[i + 1]) {
      flags.tools = args[++i].split(',').map((s) => s.trim());
    } else if (args[i] === '--yes' || args[i] === '-y') {
      flags.yes = true;
    } else if (args[i] === '--list' || args[i] === '-l') {
      flags.list = true;
    }
  }
  return flags;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolvedPath(tool, scope) {
  const global = scope === 'global';
  switch (tool) {
    case 'claude':
      return global
        ? join(homedir(), '.claude', 'agents', 'lgpd-compliance-architect.md')
        : join(CWD, '.claude', 'agents', 'lgpd-compliance-architect.md');
    case 'cursor':
      return join(CWD, '.cursor', 'rules', 'lgpd-compliance.mdc');
    case 'windsurf':
      return join(CWD, '.windsurfrules');
    case 'vscode':
      return join(CWD, '.github', 'copilot-instructions.md');
    case 'cline':
      return join(CWD, '.clinerules');
    case 'opencode':
      return global
        ? join(homedir(), '.config', 'opencode', 'agents', 'lgpd-compliance-architect.md')
        : join(CWD, '.opencode', 'agents', 'lgpd-compliance-architect.md');
    default:
      return '';
  }
}

function displayPath(absPath) {
  try {
    const rel = relative(CWD, absPath);
    return rel.startsWith('..') ? absPath : rel;
  } catch {
    return absPath;
  }
}

function toolLabel(value) {
  return TOOLS.find((t) => t.value === value)?.label ?? value;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const flags = parseArgs();

  // --list
  if (flags.list) {
    console.log(`\n${pc.bold('Ferramentas disponíveis:')}\n`);
    for (const t of TOOLS) {
      console.log(`  ${pc.cyan(t.value.padEnd(10))} ${t.label.padEnd(20)} ${pc.dim(t.hint)}`);
    }
    console.log(`\n${pc.bold('Escopos:')}\n`);
    console.log(`  ${pc.cyan('project'.padEnd(10))} Instala no diretório atual`);
    console.log(`  ${pc.cyan('global'.padEnd(10))} Instala globalmente (Claude Code → ~/.claude/agents)\n`);
    process.exit(0);
  }

  // ── Banner ──
  console.log('');
  intro(
    `${pc.bgCyan(pc.black('  LGPD Compliance Architect  '))} ${pc.dim(`v${version}`)}`
  );

  // ── Etapa 1: Escopo ──
  let scope = flags.scope;

  if (!scope) {
    log.step(pc.bold('Etapa 1 de 3 — Escopo de instalação'));

    scope = await select({
      message: 'Onde instalar o agente?',
      options: [
        {
          value: 'project',
          label: 'Este projeto',
          hint: 'instala somente no diretório atual',
        },
        {
          value: 'global',
          label: 'Todos os projetos',
          hint: 'Claude Code → ~/.claude/agents  |  outros → diretório atual',
        },
      ],
    });

    if (isCancel(scope)) {
      cancel('Instalação cancelada.');
      process.exit(0);
    }
  }

  // ── Etapa 2: Ferramentas ──
  let selectedTools = flags.tools;

  if (!selectedTools) {
    log.step(pc.bold('Etapa 2 de 3 — Ferramentas de IA'));

    selectedTools = await multiselect({
      message: 'Quais ferramentas instalar?',
      options: TOOLS.map((t) => {
        if (scope === 'global') {
          if (t.value === 'claude') return { ...t, hint: '~/.claude/agents/lgpd-compliance-architect.md' };
          if (t.value === 'opencode') return { ...t, hint: '~/.config/opencode/agents/lgpd-compliance-architect.md' };
        }
        return t;
      }),
      initialValues: ['claude'],
      required: true,
    });

    if (isCancel(selectedTools)) {
      cancel('Instalação cancelada.');
      process.exit(0);
    }
  }

  // Validate tool names when passed via flag
  const validTools = new Set(TOOLS.map((t) => t.value));
  const invalidTools = selectedTools.filter((t) => !validTools.has(t));
  if (invalidTools.length > 0) {
    cancel(`Ferramenta(s) inválida(s): ${invalidTools.join(', ')}\nUse --list para ver as opções.`);
    process.exit(1);
  }

  // ── Etapa 3: Confirmação ──
  if (!flags.yes) {
    log.step(pc.bold('Etapa 3 de 3 — Confirmação'));

    const scopeLabel = scope === 'global' ? 'global (todos os projetos)' : 'local (este projeto)';
    const toolNames = selectedTools.map(toolLabel).join(', ');

    note(
      [
        `${pc.bold('Escopo:')}  ${scopeLabel}`,
        `${pc.bold('Ferramentas:')} ${toolNames}`,
        '',
        ...selectedTools.map((t) => {
          const p = displayPath(resolvedPath(t, scope));
          return `  ${pc.dim('→')} ${p}`;
        }),
      ].join('\n'),
      'Resumo'
    );

    const ok = await confirm({ message: 'Prosseguir com a instalação?' });

    if (isCancel(ok) || !ok) {
      cancel('Instalação cancelada.');
      process.exit(0);
    }
  }

  // ── Instalação ──
  const s = spinner();
  s.start('Compilando e instalando o agente LGPD...');

  let results;
  try {
    results = install(scope, selectedTools, PKG_ROOT, CWD);
  } catch (err) {
    s.stop(pc.red('Erro durante a compilação.'));
    log.error(err.message);
    process.exit(1);
  }

  s.stop('Instalação concluída.');
  console.log('');

  let hasError = false;
  for (const r of results) {
    if (r.success) {
      log.success(`${pc.bold(toolLabel(r.tool))}`);
      console.log(`   ${pc.dim('→')} ${displayPath(r.path)}`);
    } else {
      log.error(`${pc.bold(toolLabel(r.tool))}: ${r.error}`);
      hasError = true;
    }
  }

  // ── Próximos passos ──
  if (!hasError) {
    note(
      [
        `${pc.cyan('Auditoria completa')}`,
        `  Cole o conteúdo de ${pc.bold('agent/prompts/audit-prompt.md')} no chat`,
        '',
        `${pc.cyan('Revisão de PII em um arquivo')}`,
        `  Cole o conteúdo de ${pc.bold('agent/prompts/pii-review-prompt.md')} no chat`,
        '',
        `${pc.cyan('Scan via terminal')}`,
        `  ${pc.dim('node scripts/pii_scan.py . | python scripts/generate_report.py')}`,
      ].join('\n'),
      'Próximos passos'
    );

    outro(pc.green('Agente LGPD instalado com sucesso! Bons audits.'));
  } else {
    outro(pc.yellow('Instalação concluída com erros. Verifique as mensagens acima.'));
  }
}

main().catch((err) => {
  console.error(pc.red('\nErro inesperado:'), err.message);
  process.exit(1);
});

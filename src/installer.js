import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { compile } from './compile.js';

const SECTION_MARKER = '<!-- lgpd-compliance-architect -->';

/**
 * @param {'project'|'global'} scope
 * @param {string[]} tools  e.g. ['claude', 'cursor', 'windsurf']
 * @param {string} pkgRoot  directory of this npm package
 * @param {string} cwd      directory where the user ran the command
 */
export function install(scope, tools, pkgRoot, cwd) {
  const compiled = compile(pkgRoot);
  const results = [];

  for (const tool of tools) {
    try {
      const path = installTool(tool, scope, cwd, compiled);
      results.push({ tool, success: true, path });
    } catch (err) {
      results.push({ tool, success: false, error: err.message });
    }
  }

  return results;
}

function installTool(tool, scope, cwd, compiled) {
  const global = scope === 'global';

  switch (tool) {
    case 'claude':
      return installClaudeCode(cwd, global, compiled);
    case 'cursor':
      return installCursor(cwd, compiled);
    case 'windsurf':
      return installAppend(join(cwd, '.windsurfrules'), compiled.generic);
    case 'vscode':
      return installAppend(join(cwd, '.github', 'copilot-instructions.md'), compiled.generic, join(cwd, '.github'));
    case 'cline':
      return installAppend(join(cwd, '.clinerules'), compiled.generic);
    case 'opencode':
      return installOpenCode(cwd, global, compiled);
    default:
      throw new Error(`Ferramenta desconhecida: ${tool}`);
  }
}

function installClaudeCode(cwd, global, compiled) {
  const base = global ? join(homedir(), '.claude') : join(cwd, '.claude');
  const agentsDir = join(base, 'agents');

  ensureDir(agentsDir);

  const dest = join(agentsDir, 'lgpd-compliance-architect.md');
  writeFileSync(dest, compiled.claudeCode, 'utf-8');

  return dest;
}

function installCursor(cwd, compiled) {
  const rulesDir = join(cwd, '.cursor', 'rules');
  ensureDir(rulesDir);

  const dest = join(rulesDir, 'lgpd-compliance.mdc');
  writeFileSync(dest, compiled.cursor, 'utf-8');

  return dest;
}

function installAppend(filePath, content, dirToCreate) {
  if (dirToCreate) ensureDir(dirToCreate);

  if (existsSync(filePath)) {
    const existing = readFileSync(filePath, 'utf-8');
    if (existing.includes(SECTION_MARKER)) {
      writeFileSync(filePath, replaceBetweenMarkers(existing, content), 'utf-8');
    } else {
      writeFileSync(filePath, `${existing}\n\n${SECTION_MARKER}\n${content}\n${SECTION_MARKER}`, 'utf-8');
    }
  } else {
    writeFileSync(filePath, `${SECTION_MARKER}\n${content}\n${SECTION_MARKER}`, 'utf-8');
  }

  return filePath;
}

function replaceBetweenMarkers(text, newContent) {
  const escaped = SECTION_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escaped}[\\s\\S]*?${escaped}`, 'g');
  return text.replace(regex, `${SECTION_MARKER}\n${newContent}\n${SECTION_MARKER}`);
}

function installOpenCode(cwd, global, compiled) {
  const base = global
    ? join(homedir(), '.config', 'opencode')
    : join(cwd, '.opencode');
  const agentsDir = join(base, 'agents');

  ensureDir(agentsDir);

  const dest = join(agentsDir, 'lgpd-compliance-architect.md');
  writeFileSync(dest, compiled.openCode, 'utf-8');

  return dest;
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

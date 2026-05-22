import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOTS = ['src', 'tests', '.docs', 'scripts', 'supabase', 'CLAUDE.md', '.env.example'];
const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.sql',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
]);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'output', 'stockast-UI']);
const MOJIBAKE_PATTERNS = [
  new RegExp(`${String.fromCharCode(194)}[·§]`),
  new RegExp(`${String.fromCharCode(226)}[€”˜™€¢œ†ˆ]`),
  new RegExp(`${String.fromCharCode(240)}Ÿ`),
];

describe('source text encoding', () => {
  it('does not contain common UTF-8 mojibake sequences', () => {
    const offenders: string[] = [];

    for (const file of collectTextFiles(process.cwd())) {
      const text = readFileSync(file, 'utf8');
      if (MOJIBAKE_PATTERNS.some((pattern) => pattern.test(text))) {
        offenders.push(file.replace(process.cwd() + '\\', '').replaceAll('\\', '/'));
      }
    }

    expect(offenders).toEqual([]);
  });
});

function collectTextFiles(cwd: string): string[] {
  const files: string[] = [];
  for (const root of ROOTS) {
    const abs = join(cwd, root);
    if (!existsSync(abs)) continue;
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      walk(abs, files);
    } else if (isTextFile(abs)) {
      files.push(abs);
    }
  }
  return files;
}

function walk(dir: string, files: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        walk(join(dir, entry.name), files);
      }
      continue;
    }
    const abs = join(dir, entry.name);
    if (isTextFile(abs)) {
      files.push(abs);
    }
  }
}

function isTextFile(file: string): boolean {
  if (file.endsWith('.env.example')) return true;
  const dot = file.lastIndexOf('.');
  return dot >= 0 && TEXT_EXTENSIONS.has(file.slice(dot));
}

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/styles/ui-kit-utilities.css'), 'utf8');

describe('ui density tokens', () => {
  it('keeps shared primitives on the tighter density scale', () => {
    expect(source).toContain('height: 40px;');
    expect(source).toContain('padding: 0 16px;');
    expect(source).toContain('font-size: 14px;');

    expect(source).toContain(".sk-btn[data-size='lg'] {\n  height: 48px;");
    expect(source).toContain('padding: 0 20px;');
    expect(source).toContain('font-size: 15px;');

    expect(source).toContain(".sk-btn[data-size='sm'] {\n  height: 34px;");
    expect(source).toContain('padding: 0 10px;');
    expect(source).toContain('font-size: 12px;');

    expect(source).toContain('.sk-input {\n  width: 100%;\n  height: 44px;');
    expect(source).toContain('padding: 0 12px;');

    expect(source).toContain('.sk-card {\n  background: var(--sk-surface);');
    expect(source).toContain('padding: 16px;');

    expect(source).toContain('.sk-pill {\n  display: inline-flex;');
    expect(source).toContain('gap: 5px;');
    expect(source).toContain('padding: 3px 8px;');
    expect(source).toContain('font-size: 11px;');

    expect(source).toContain('.sk-nav {\n  display: flex;');
    expect(source).toContain('padding: 5px 4px 3px;');
    expect(source).toContain('height: 56px;');

    expect(source).toContain('.sk-topbar {\n  display: flex;');
    expect(source).toContain('padding: 10px 16px;');
  });
});

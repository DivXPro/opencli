import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ArgumentError } from './errors.js';
import { listOpenCliSkills, readOpenCliSkill } from './skills.js';

function makePackageRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'toycli-skills-'));
  fs.mkdirSync(path.join(root, 'skills', 'toycli-browser', 'references'), { recursive: true });
  fs.mkdirSync(path.join(root, 'skills', 'toycli-autofix'), { recursive: true });
  fs.mkdirSync(path.join(root, 'skills', 'smart-search'), { recursive: true });
  fs.writeFileSync(path.join(root, 'package.json'), '{"name":"@toy-box/opencli"}\n');
  fs.writeFileSync(path.join(root, 'skills', 'toycli-browser', 'SKILL.md'), [
    '---',
    'name: toycli-browser',
    'description: Browser control skill',
    'version: 1.2.3',
    '---',
    '',
    '# Browser',
    '',
    'Body.',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'skills', 'toycli-browser', 'references', 'targets.md'), '# Targets\n');
  fs.writeFileSync(path.join(root, 'skills', 'toycli-autofix', 'SKILL.md'), [
    '---',
    'name: toycli-autofix',
    'description: Fix adapters: keep scope narrow',
    '---',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'skills', 'smart-search', 'SKILL.md'), [
    '---',
    'name: smart-search',
    'description: Search skill',
    '---',
    '',
  ].join('\n'));
  return root;
}

describe('toycli skills content', () => {
  it('lists only toycli-prefixed skills', () => {
    const root = makePackageRoot();

    expect(listOpenCliSkills(root).map((skill) => skill.name)).toEqual([
      'toycli-autofix',
      'toycli-browser',
    ]);
    expect(listOpenCliSkills(root).find((skill) => skill.name === 'toycli-autofix')?.description)
      .toBe('Fix adapters: keep scope narrow');
  });

  it('reads a skill SKILL.md and reference file', () => {
    const root = makePackageRoot();

    expect(readOpenCliSkill('toycli-browser', '', root)).toMatchObject({
      skill: 'toycli-browser',
      path: 'SKILL.md',
    });
    expect(readOpenCliSkill('toycli-browser/references/targets.md', '', root)).toMatchObject({
      skill: 'toycli-browser',
      path: 'references/targets.md',
      content: '# Targets\n',
    });
    expect(readOpenCliSkill('toycli-browser', 'references/targets.md', root).content).toBe('# Targets\n');
  });

  it('rejects non-toycli skills and path traversal', () => {
    const root = makePackageRoot();

    expect(() => readOpenCliSkill('smart-search', '', root)).toThrow(ArgumentError);
    expect(() => readOpenCliSkill('toycli-browser/../smart-search/SKILL.md', '', root)).toThrow(ArgumentError);
    expect(() => readOpenCliSkill('toycli-browser', '../../package.json', root)).toThrow(ArgumentError);
  });
});

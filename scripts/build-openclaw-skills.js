#!/usr/bin/env node
// Generate the OpenClaw / ClawHub skill package (.openclaw/skills/) from the
// canonical skills/. OpenClaw skills are SKILL.md (frontmatter + body), the same
// format ponytail already uses, with one difference: `description` must be a
// single line under 160 chars. Each host-specific description stays within
// that limit. The body is copied
// verbatim from skills/<name>/SKILL.md so the ruleset never drifts; only the
// frontmatter is rewritten.
//
// Run:  node scripts/build-openclaw-skills.js
// tests/openclaw-skills.test.js fails if the committed copies are stale.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HOMEPAGE = 'https://github.com/DietrichGebert/ponytail';

const DESCRIPTIONS = {
  'ponytail': 'Apply YAGNI and stdlib-first implementation when the user asks for the simplest solution or invokes Ponytail.',
  'ponytail-review': 'Review a diff for over-engineering when the user asks what can be deleted or simplified.',
  'ponytail-audit': 'Audit a repository for over-engineering when the user asks for a repo-wide deletion or simplification report.',
  'ponytail-debt': 'Collect ponytail: shortcut comments into a debt ledger when the user asks what Ponytail deferred.',
  'ponytail-gain': "Show Ponytail's benchmark results as a compact scoreboard when the user asks about its measured impact.",
  'ponytail-help': 'Show a quick reference for Ponytail modes and commands when the user asks how to use Ponytail.',
};

const NAMES = Object.keys(DESCRIPTIONS);

function sourceBody(name) {
  const src = fs.readFileSync(path.join(ROOT, 'skills', name, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
  const fm = src.match(/^---\n[\s\S]*?\n---\n?/);
  if (!fm) throw new Error(`skills/${name}/SKILL.md has no frontmatter`);
  return src.slice(fm[0].length);
}

function render(name) {
  const desc = DESCRIPTIONS[name];
  if (desc.length > 160 || desc.includes('\n') || desc.includes('"')) {
    throw new Error(`description for ${name} must be one line, no quotes, under 160 chars`);
  }
  const frontmatter =
    `---\nname: ${name}\ndescription: "${desc}"\nhomepage: ${HOMEPAGE}\nlicense: MIT\n---\n`;
  return frontmatter + sourceBody(name);
}

function outPath(name) {
  return path.join(ROOT, '.openclaw', 'skills', name, 'SKILL.md');
}

module.exports = { DESCRIPTIONS, NAMES, render, outPath, sourceBody };

if (require.main === module) {
  for (const name of NAMES) {
    const p = outPath(name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, render(name));
    console.log('wrote', path.relative(ROOT, p).replace(/\\/g, '/'));
  }
}

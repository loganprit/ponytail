#!/usr/bin/env node
// Every ponytail command the pi extension registers must also ship as a
// file-based command for the hosts that need one: Claude Code (commands/*.toml,
// which Gemini CLI reuses) and OpenCode (.opencode/command/*.md). /ponytail-help
// was advertised in the README and the help card but missing both files; this
// guards that drift -- a registered command with no adapter file fails here.

const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// pi-extension registers the canonical command set.
const piSource = fs.readFileSync(path.join(root, 'pi-extension', 'index.js'), 'utf8');
const commands = [...piSource.matchAll(/registerCommand\(["']([\w-]+)["']/g)].map((m) => m[1]);

test('pi registers at least the base command', () => {
  assert.ok(commands.includes('ponytail'), 'expected pi to register a ponytail command');
});

test('every registered command ships a Claude commands/*.toml', () => {
  for (const name of commands) {
    assert.ok(
      fs.existsSync(path.join(root, 'commands', `${name}.toml`)),
      `missing commands/${name}.toml`,
    );
  }
});

test('every registered command ships an OpenCode .opencode/command/*.md', () => {
  for (const name of commands) {
    assert.ok(
      fs.existsSync(path.join(root, '.opencode', 'command', `${name}.md`)),
      `missing .opencode/command/${name}.md`,
    );
  }
});

test('ponytail-debt rg scan reaches nested source and skips generated directories', (t) => {
  const probe = spawnSync('rg', ['--version'], { encoding: 'utf8' });
  if (probe.error?.code === 'ENOENT') {
    t.skip('rg is unavailable');
    return;
  }

  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'ponytail-debt-'));
  const write = (relative, contents) => {
    const file = path.join(fixture, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
  };

  try {
    write('src/nested.js', '// ponytail: source marker');
    write('.hidden/source.js', '// ponytail: hidden source marker');
    for (const directory of ['node_modules', '.git', 'build', 'dist']) {
      write(`${directory}/nested.js`, `// ponytail: ignored ${directory} marker`);
    }

    const result = spawnSync(
      'rg',
      [
        '--hidden',
        '-n',
        '(#|//) ?ponytail:',
        '-g',
        '!node_modules',
        '-g',
        '!.git',
        '-g',
        '!build',
        '-g',
        '!dist',
        '.',
      ],
      { cwd: fixture, encoding: 'utf8' },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /src\/nested\.js/);
    assert.match(result.stdout, /\.hidden\/source\.js/);
    for (const directory of ['node_modules', '.git', 'build', 'dist']) {
      assert.doesNotMatch(result.stdout, new RegExp(`${directory}/`));
    }
  } finally {
    fs.rmSync(fixture, { force: true, recursive: true });
  }
});

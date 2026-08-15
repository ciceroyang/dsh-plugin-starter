/**
 * Generator tests: run the scaffold into a temp directory and verify the
 * token replacement and file layout.
 * @module dsh-plugin-starter/tests/generator
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const GENERATOR = fileURLToPath(new URL('../generator.mjs', import.meta.url))

function runScaffold(name, extra = []) {
  const dir = mkdtempSync(join(tmpdir(), 'cdp-'))
  const out = join(dir, 'out')
  execFileSync(process.execPath, [GENERATOR, name, '--out', out, ...extra], { stdio: 'pipe' })
  return { dir, out }
}

test('scaffold creates the full layout with tokens replaced', () => {
  const { dir, out } = runScaffold('my-awesome-plugin', ['--desc', 'Does something useful.'])
  for (const rel of [
    'package.json', 'cordis.patch.yml', 'index.js', 'lib/hello.js',
    'skills/my-awesome-plugin/SKILL.md', 'tests/hello.test.js',
    'README.md', '.gitignore', '.github/workflows/ci.yml',
  ]) {
    assert.ok(existsSync(join(out, rel)), 'missing ' + rel)
  }
  const pkg = JSON.parse(readFileSync(join(out, 'package.json'), 'utf8'))
  assert.equal(pkg.name, 'my-awesome-plugin')
  assert.equal(pkg.description, 'Does something useful.')
  const patch = readFileSync(join(out, 'cordis.patch.yml'), 'utf8')
  assert.ok(patch.includes('my-awesome-plugin'))
  const skill = readFileSync(join(out, 'skills/my-awesome-plugin/SKILL.md'), 'utf8')
  assert.ok(skill.includes('my-awesome-plugin_greet'))
  assert.ok(!skill.includes('{{'))
  rmSync(dir, { recursive: true, force: true })
})

test('scaffolded project passes its own tests', () => {
  const { dir, out } = runScaffold('demo-plugin')
  // The parent test runner injects NODE_TEST_CONTEXT=child-v8; clear it so the
  // child runner reports to stdout instead of going silent.
  const env = { ...process.env }
  delete env.NODE_TEST_CONTEXT
  const result = execFileSync(process.execPath, ['--test'], { cwd: out, stdio: 'pipe', encoding: 'utf8', env })
  assert.ok(result.includes('pass 1'), 'scaffolded tests should pass')
  rmSync(dir, { recursive: true, force: true })
})

test('--verify runs the generated project tests and passes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cdp-v-'))
  const out = join(dir, 'out')
  const result = execFileSync(process.execPath, [GENERATOR, 'verify-demo', '--out', out, '--verify'], { stdio: 'pipe', encoding: 'utf8' })
  assert.ok(result.includes('verify: PASS'), 'verify should report PASS')
  rmSync(dir, { recursive: true, force: true })
})

test('generator rejects invalid names', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cdp-bad-'))
  for (const bad of ['BadName', 'has_underscore', '-leading', 'two--dashes', '9start']) {
    assert.throws(
      () => execFileSync(process.execPath, [GENERATOR, bad, '--out', join(dir, bad)], { stdio: 'pipe' }),
      (error) => error.status !== 0,
      'should reject ' + bad,
    )
  }
  rmSync(dir, { recursive: true, force: true })
})

test('generator refuses to overwrite a non-empty directory', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cdp-full-'))
  const out = join(dir, 'existing')
  mkdirSync(out, { recursive: true })
  writeFileSync(join(out, 'keep.txt'), 'x')
  assert.throws(
    () => execFileSync(process.execPath, [GENERATOR, 'fine-name', '--out', out], { stdio: 'pipe' }),
    (error) => error.status !== 0,
  )
  rmSync(dir, { recursive: true, force: true })
})

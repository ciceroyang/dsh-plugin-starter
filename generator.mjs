#!/usr/bin/env node
/**
 * create-dsh-plugin — scaffold a battle-tested DeepSeek Harness plugin.
 *
 * Zero dependencies, plain ESM, Node >= 18. Copies the templates/ directory,
 * replacing {{NAME}} (kebab-case plugin id), {{DESC}} (one-line description),
 * and {{PKG_NAME}} (npm package name) in file contents and directory names.
 *
 * Usage:
 *   node generator.mjs my-plugin --desc "One-line description"
 *   node generator.mjs my-plugin --out ./packages/my-plugin
 *
 * @module create-dsh-plugin
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

function fail(message) {
  console.error('error: ' + message)
  process.exit(1)
}

function parseArgs(argv) {
  const args = { name: null, desc: '', out: null }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--desc') {
      args.desc = argv[++i] ?? fail('--desc requires a value')
    } else if (arg === '--out') {
      args.out = argv[++i] ?? fail('--out requires a value')
    } else if (arg.startsWith('-')) {
      fail('unknown option ' + arg)
    } else if (args.name === null) {
      args.name = arg
    } else {
      fail('unexpected argument ' + arg)
    }
  }
  if (args.name === null) fail('usage: node generator.mjs <plugin-name> [--desc "..."] [--out <dir>]')
  if (!KEBAB.test(args.name)) fail('plugin name must be kebab-case, got "' + args.name + '"')
  return args
}

function copyTemplateDir(srcDir, destDir, tokens) {
  for (const entry of readdirSync(srcDir)) {
    const src = join(srcDir, entry)
    const stat = statSync(src)
    if (stat.isDirectory()) {
      const renamed = entry.split('{{NAME}}').join(tokens.name)
      copyTemplateDir(src, join(destDir, renamed), tokens)
      continue
    }
    const text = readFileSync(src, 'utf8')
    let out = text.split('{{NAME}}').join(tokens.name)
    out = out.split('{{DESC}}').join(tokens.desc)
    out = out.split('{{PKG_NAME}}').join(tokens.pkg)
    const dest = join(destDir, entry)
    mkdirSync(join(dest, '..'), { recursive: true })
    writeFileSync(dest, out, 'utf8')
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const here = fileURLToPath(new URL('.', import.meta.url))
  const srcDir = join(here, 'templates')
  const outDir = resolve(args.out ?? args.name)
  if (existsSync(outDir) && readdirSync(outDir).length > 0) {
    fail('target directory is not empty: ' + outDir)
  }
  copyTemplateDir(srcDir, outDir, { name: args.name, desc: args.desc || 'A DeepSeek Harness plugin.', pkg: args.name })
  console.log('created ' + outDir)
  console.log('')
  console.log('next steps:')
  console.log('  1. edit ' + join(outDir, 'index.js') + ' and the skill in ' + join(outDir, 'skills', args.name, 'SKILL.md'))
  console.log('  2. run tests:  cd ' + outDir + ' && node --test')
  console.log('  3. dev-load it: dsh web --patch <overlay with absolute path to ' + join(outDir, 'index.js') + '>')
  console.log('  4. install it:  dsh plugin --profile web add ' + outDir)
  console.log('  5. publish: tag the repo with the dsh-plugin topic')
}

main()

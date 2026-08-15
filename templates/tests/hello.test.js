/**
 * Unit tests for the pure example helper.
 * @module {{PKG_NAME}}/tests/hello
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildGreeting } from '../lib/hello.js'

test('buildGreeting greets by name', () => {
  assert.equal(buildGreeting('Ada'), 'Hello, Ada!')
})

/**
 * Pure example helper — keep your deterministic logic here so it stays
 * unit-testable without any harness service.
 * @module {{PKG_NAME}}/lib/hello
 */

/**
 * Build the greeting text.
 * @param {string} name - who to greet.
 * @returns {string} greeting line.
 */
export function buildGreeting(name) {
  return 'Hello, ' + name + '!'
}

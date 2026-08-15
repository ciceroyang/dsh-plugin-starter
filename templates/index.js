/**
 * {{NAME}} host plugin — replace this description with yours.
 *
 * Skeleton follows the official tool tutorial plus a runtime skill. The
 * bundled SKILL.md teaches the agent when and how to use the tool.
 *
 * @module {{PKG_NAME}}
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { buildGreeting } from './lib/hello.js'

export const name = '{{NAME}}'

export const inject = ['tools']

const SKILL_FILE = fileURLToPath(new URL('./skills/{{NAME}}/SKILL.md', import.meta.url))

/**
 * Register the example tool and the companion skill.
 * @param {import('@deepseek-ai/cordis').Context} ctx - cordis context.
 * @param {object} [config] - optional plugin config from cordis.patch.yml.
 */
export function apply(ctx, config) {
  const disposers = []

  const skills = ctx.get('skills')
  if (skills && typeof skills.register === 'function') {
    try {
      disposers.push(skills.register({
        name: '{{NAME}}',
        description: '{{DESC}}',
        content: readFileSync(SKILL_FILE, 'utf8'),
        source: 'runtime',
        provider: '{{PKG_NAME}}',
      }))
    } catch (error) {
      ctx.logger?.warn?.('{{NAME}}: failed to register skill: ' + String(error))
    }
  }

  disposers.push(ctx.tools.register(defineTool({
    name: '{{NAME}}_greet',
    description: 'Greet someone by name. Replace with your real tool.',
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: 'The name to greet',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return buildGreeting(args.name)
    },
  })))

  return () => {
    for (const dispose of disposers) {
      try {
        dispose()
      } catch {
        // disposal failures must not break unload
      }
    }
  }
}

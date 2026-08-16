/**
 * Browser half of {{NAME}}: registers a settings section for the plugin.
 *
 * Requires tsdown + React (see package.json scripts.build after generation).
 * Settings RPC is loopback-only: the section is inert in remote browsers.
 *
 * The registration shape follows the official ui-settings-models package;
 * adapt the render thunk and the injected props to the rc your profile runs.
 */

import * as React from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the 'settings.section' slot into the SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

export const inject = ['slots', 'locale', 'connection', 'remote']

/** Minimal form state: resolved value of the {{NAME}} settings namespace. */
interface {{PascalName}}State {
  enabled?: boolean
  label?: string
}

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register('settings.{{NAME}}', {
    zh: { title: '{{DESC}}' },
    en: { title: '{{DESC}}' },
  }), '{{NAME}}: settings copy dictionaries')

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: '{{NAME}}',
    /**
     * Follow ui-settings-models' ModelsSection for the full injected-props
     * contract; the minimal form below demonstrates the data path:
     * settings.describe -> user section -> settings.update.
     */
    render: (injected: any) => {
      const { connection, t } = injected
      const [state, setState] = React.useState<{{PascalName}}State>({})
      React.useEffect(() => {
        let alive = true
        void connection.api.settings.describe({}).then((response: any) => {
          if (!alive || !response.result.ok) return
          const view = response.result.value.namespaces.find((n: any) => n.ns === '{{NAME}}')
          if (view) setState(view.user ?? view.value ?? {})
        })
        return () => { alive = false }
      }, [connection])
      const toggle = () => {
        const next = { ...state, enabled: !state.enabled }
        setState(next)
        void connection.api.settings.update('{{NAME}}', { enabled: next.enabled })
      }
      return (
        <section>
          <h2>{t('title')}</h2>
          <label>
            <input type="checkbox" checked={!!state.enabled} onChange={toggle} />
            enabled
          </label>
          <p>label: {String(state.label ?? '-')}</p>
        </section>
      )
    },
  }))
}

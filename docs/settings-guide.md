# 给插件加"设置卡片"指南(源码级,基于 rc.6 实测)

官方设置页的机制是开放的,本指南给出最小接入路径与全部坑。结论先行:
**host 半免构建,client 半需要 tsdown + React**;settings RPC 是 loopback-only。

## 一、机制总览

- 设置页是一个 slot 体系(dsh-client-ui-settings):`settings.section`(每功能一页)、`settings.plugins.tab`(插件区页)
- host 插件用 schemastery `Schema` 声明 Config;settings seam 把 schema envelope 和值层(base → 默认 → user 层)通过 settings RPC 提供给浏览器
- client 插件注册 slot,表单读写 user 层,持久化到 settings.yaml
- 表单校验用 dsh-client-schema-form 的 `rehydrateSchema` / `validateDraft`(该包不做渲染,控件自写)

## 二、Host 半(免构建)

    import Schema from '@deepseek-ai/schemastery'

    export const name = 'my-plugin'
    export const Config = Schema.object({
      enabled: Schema.boolean().default(true).description('开关'),
      label: Schema.string().default('hello').description('文案'),
    })
    export function apply(ctx, config) {
      // config.enabled / config.label 在这里生效
    }

注意:
- Config 必须是 schemastery Schema(不是手写校验),否则浏览器侧生成不出表单
- 命名空间/注册面的准确 API 以 `@deepseek-ai/dsh-settings` 包 README 为准(rc 期接口会动)

## 三、Client 半(需要 tsdown 构建)

package.json 加:

    "dsh": { "client": { "inject": ["@deepseek-ai/dsh-client-ui-settings", "@deepseek-ai/dsh-api-remotes", "@deepseek-ai/dsh-client-locale"], "platform": "web" } },
    "exports": { "./client": "./lib/client.js" }

client/index.tsx 的最小形态(从官方 ui-settings-models 的真实代码提炼):

    import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
    export const inject = ['slots', 'locale', 'connection', 'remote']
    export function apply(ctx: ClientContext): void {
      ctx.effect(() => ctx.locale.register('settings.my-plugin', { zh: {...}, en: {...} }))
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'my-plugin',
        // 导航标题/渲染 thunk 与注入面,照 ui-settings-models 的 ModelsSection 抄
      }))
    }

表单控件:通过 connection.api 的 settings RPC 读 `{ schema, value, user, revision }`,编辑 user 层后写回;写前用 `validateDraft(rehydrateSchema(schema), draft)` 校验。

## 四、必知坑

1. **settings RPC 是 loopback-only**(官方 README 明文):远程浏览器里设置页不可用——局域网访问的用户不要指望远程配置(见官方讨论 #1733)
2. schema envelope 是可执行内容(revive 用 new Function),只信任同源 host 下发
3. `applies: 'live' | 'restart'`:有些配置项改完要重启才生效,UI 上要给提示
4. 可抄的完整实现:官方 `packages/client/ui-settings-models`(Models 页)与 `dsh-client-ui-plan-execute`(设置行)

## 五、本仓库的状态

- 本指南随 starter 发布;host 侧示例见 `examples/settings-host-config.js`
- client 侧完整模板(--with-settings 生成)在路线图上,等 rc 期设置面稳定后内建

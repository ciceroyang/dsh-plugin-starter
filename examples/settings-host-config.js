// 设置卡片的 host 半(免构建)。声明 schemastery Config 后,
// 浏览器侧即可拿到 schema envelope 渲染表单;client 半见 docs/settings-guide.md。
import Schema from '@deepseek-ai/schemastery'

export const name = 'my-plugin'

export const Config = Schema.object({
  enabled: Schema.boolean().default(true).description('启用插件'),
  label: Schema.string().default('hello').description('问候文案'),
  retries: Schema.number().default(2).min(0).max(5).description('重试次数'),
})

export function apply(ctx, config) {
  // config 已按上面的 Schema 校验并填好默认值
  console.log('[my-plugin] enabled=' + config.enabled + ' label=' + config.label)
}

# dsh-plugin-starter

Scaffold a battle-tested DeepSeek Harness plugin in one command: host plugin,
tool, runtime skill, unit tests, CI, and the bundle manifest — zero
dependencies, no build step.

## Usage

    node generator.mjs my-plugin --desc "One-line description"
    node generator.mjs my-plugin --out ./packages/my-plugin
    node generator.mjs my-plugin --verify   # smoke-test right after scaffolding
    node generator.mjs my-plugin --with-settings   # settings card (client half, tsdown + React)

The scaffold passes its own tests immediately (run node --test inside it).

Layout:

    index.js              host plugin (example tool + runtime skill)
    lib/hello.js          pure-function example (unit-test friendly)
    skills/<name>/SKILL.md  model-facing skill manual
    tests/hello.test.js   node:test suite
    cordis.patch.yml      bundle patch layer
    package.json          dsh.bundle manifest + peer deps
    .github/workflows/ci.yml  four-node matrix

## Why this shape

The template encodes community pitfalls (see the tutorial):
- object output schemas need additionalProperties
- --patch absolute-path plugins resolve deps from their own directory
- registrations are effects: collect disposers, clean up on unload
- optional services via ctx.get('skills'), not inject
- keep deterministic logic in lib/ so tests stay harness-free

## Settings-card variant (--with-settings)

Adds client/index.tsx (settings.section registration + minimal form), the dsh.client manifest, and tsdown build scripts/deps on top of the base scaffold. After generation run `pnpm install && pnpm build` to emit lib/client.js. The settings RPC is loopback-only (remote browsers get no settings page). Full mechanism: docs/settings-guide.md.

## Publishing your plugin

1. Edit index.js and SKILL.md
2. Create the GitHub repo and add the dsh-plugin topic
3. Open a listing PR against awesome-deepseek-harness

## References

- Field guide with 6 real pitfalls: https://github.com/ciceroyang/dsh-report-studio/blob/main/docs/tutorial-zh.md
- Complete example plugin: https://github.com/ciceroyang/dsh-report-studio

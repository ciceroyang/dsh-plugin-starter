# dsh-plugin-starter

一键生成"实战验证过"的 DeepSeek Harness 插件工程:宿主插件 + 工具 + 运行时 skill + 单测 + CI + bundle 协议,全部按社区踩坑经验预置,零依赖、免构建。

## 用法

    node generator.mjs my-plugin --desc "一句话描述"
    # 或指定输出目录
    node generator.mjs my-plugin --out ./packages/my-plugin

生成的结构:

    my-plugin/
    ├── index.js              宿主插件:greet 示例工具 + 运行时 skill 注册
    ├── lib/hello.js          纯函数示例(单测友好)
    ├── skills/my-plugin/SKILL.md  技能说明书
    ├── tests/hello.test.js   node:test 单测
    ├── cordis.patch.yml      bundle patch 层
    ├── package.json          dsh.bundle manifest + peer 依赖
    ├── .github/workflows/ci.yml  4 版本 Node 矩阵
    └── README.md             含开发/安装/发布清单

生成即通过测试:cd 进目录跑 node --test。

## 为什么值得用

模板把下面这些坑全部避开(详见配套教程):
- object 输出 schema 缺 additionalProperties 注册即失败
- --patch 绝对路径插件的模块解析(node_modules 软链)
- 注册是效果:disposer 收集与卸载清理
- 可选服务用 ctx.get('skills') 而不是 inject
- 单测保持纯函数,不依赖 harness 服务

## 发布你的插件

1. 改 index.js 和 SKILL.md
2. GitHub 建仓库,打 topic:dsh-plugin
3. 给 awesome-deepseek-harness 提收录 PR

## 参考

- 实战教程(含 6 个实测坑):https://github.com/ciceroyang/dsh-report-studio/blob/main/docs/tutorial-zh.md
- 完整插件实例:https://github.com/ciceroyang/dsh-report-studio

# {{PKG_NAME}}

{{DESC}}

Generated with [dsh-plugin-starter](https://github.com/ciceroyang/dsh-plugin-starter).

## 结构

    index.js             宿主插件:工具 + 运行时 skill 注册
    lib/                 纯函数(可单测,不依赖任何 harness 服务)
    skills/{{NAME}}/SKILL.md  技能说明书(模型视角)
    tests/                node:test 单测
    cordis.patch.yml     bundle patch 层
    package.json         dsh.bundle manifest

## 本地开发

    node --test

用 --patch 覆盖层加载(插件路径必须绝对):

    dsh --profile headless --patch ./dev.cordis.yml "任务"

## 安装

    dsh plugin --profile web add <本目录>

## 发布

1. GitHub 建仓库并打 topic:dsh-plugin
2. 给 awesome-deepseek-harness 提收录 PR(中英双语各一条)

## 参考

- 官方插件教程与踩坑记录:https://github.com/ciceroyang/dsh-report-studio/blob/main/docs/tutorial-zh.md
- 完整实例:https://github.com/ciceroyang/dsh-report-studio

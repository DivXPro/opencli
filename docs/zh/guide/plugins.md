# 插件

ToyCLI 支持社区贡献的 plugins。你可以从 GitHub 安装第三方 adapters，它们会和内置 commands 一起在启动时自动发现。

## 安装插件

```bash
# 安装插件
toycli plugin install github:ByteYue/toycli-plugin-github-trending

# 列出已安装插件
toycli plugin list

# 更新单个插件
toycli plugin update github-trending

# 更新全部已安装插件
toycli plugin update --all

# 使用插件（本质上就是普通 command）
toycli github-trending today

# 卸载插件
toycli plugin uninstall github-trending
```

## 插件目录结构

Plugins 存放在 `~/.toycli/plugins/<name>/`。每个子目录都会在启动时扫描 `.ts`、`.js` 命令文件，格式与内置 adapters 相同。

## 安装来源

```bash
toycli plugin install github:user/repo
toycli plugin install github:user/repo/subplugin   # 安装 monorepo 中的指定子插件
toycli plugin install https://github.com/user/repo
```

如果仓库名带 `toycli-plugin-` 前缀，本地目录会自动去掉这个前缀。例如 `toycli-plugin-hot-digest` 会变成 `hot-digest`。

## 插件清单 (`toycli-plugin.json`)

插件可以在仓库根目录放置 `toycli-plugin.json` 来声明元数据：

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "toycli": ">=1.0.0",
  "description": "我的插件"
}
```

| 字段 | 说明 |
|------|------|
| `name` | 插件名称（覆盖从仓库名推导的名称） |
| `version` | 语义化版本 |
| `toycli` | 所需的 toycli 版本范围（如 `>=1.0.0`、`^1.2.0`） |
| `description` | 描述 |
| `plugins` | Monorepo 子插件声明（见下文） |

清单文件是可选的——没有它的插件依然可以正常工作。

## Monorepo 插件

一个仓库可以通过在 `toycli-plugin.json` 中声明 `plugins` 字段来包含多个插件：

```json
{
  "version": "1.0.0",
  "toycli": ">=1.0.0",
  "description": "我的插件合集",
  "plugins": {
    "polymarket": {
      "path": "packages/polymarket",
      "description": "预测市场分析",
      "version": "1.2.0"
    },
    "defi": {
      "path": "packages/defi",
      "description": "DeFi 协议数据",
      "version": "0.8.0"
    },
    "experimental": {
      "path": "packages/experimental",
      "disabled": true
    }
  }
}
```

```bash
# 安装 monorepo 中的全部子插件
toycli plugin install github:user/toycli-plugins

# 安装指定子插件
toycli plugin install github:user/toycli-plugins/polymarket
```

- Monorepo 只 clone 一次到 `~/.toycli/monorepos/<repo>/`
- 每个子插件通过 symlink 出现在 `~/.toycli/plugins/<name>/`
- 更新任何子插件会拉取整个 monorepo 并刷新所有子插件
- 卸载最后一个子插件时，monorepo 目录会被自动清理

## 版本追踪

ToyCLI 会把已安装 plugin 的版本记录到 `~/.toycli/plugins.lock.json`。每条记录会保存 plugin source、当前 git commit hash、安装时间，以及最近一次更新时间。只要有这份元数据，`toycli plugin list` 就会显示对应的短 commit hash。

## Pipeline plugin 示例

```text
my-plugin/
  package.json
  hot.ts
```

`hot.ts`:

```typescript
import { cli, Strategy } from '@toy-box/opencli/registry';

cli({
  site: 'my-plugin',
  name: 'hot',
  description: 'Example plugin command',
  access: 'read',
  example: 'toycli my-plugin hot -f yaml',
  strategy: Strategy.PUBLIC,
  browser: false,
  columns: ['title', 'url'],
  pipeline: [
    { evaluate: `() => [{ title: 'hello', url: 'https://example.com' }]` },
  ],
});
```

## func() plugin 示例

```text
my-plugin/
  index.ts
  package.json
```

```json
{
  "name": "toycli-plugin-my-plugin",
  "type": "module"
}
```

```ts
import { cli, Strategy } from '@toy-box/opencli/registry';

cli({
  site: 'my-plugin',
  name: 'hot',
  description: 'Example TS plugin command',
  access: 'read',
  example: 'toycli my-plugin hot -f yaml',
  strategy: Strategy.PUBLIC,
  browser: false,
  columns: ['title', 'url'],
  func: async () => [{ title: 'hello', url: 'https://example.com' }],
});
```

运行 `toycli plugin install` 时，TS plugins 会自动完成基础设置：

1. 安装 plugin 自身依赖
2. 补齐 TypeScript 运行环境
3. 将宿主 `@toy-box/opencli` 链接到 plugin 的 `node_modules/`，保证 `@toy-box/opencli/registry` 指向当前宿主版本

## 示例 plugins

- `toycli-plugin-github-trending`：GitHub Trending 仓库
- `toycli-plugin-hot-digest`：多平台热点聚合（zhihu、weibo、bilibili、v2ex、stackoverflow、reddit、linux-do）
- `toycli-plugin-juejin`：稀土掘金热榜、分类和文章流
- `toycli-plugin-rubysec`：RubySec 漏洞归档与单篇漏洞文章读取

## 排查问题

### TS plugin import 报错

如果看到 `Cannot find module '@toy-box/opencli/registry'`，通常是宿主 symlink 失效。重新安装 plugin 即可：

```bash
toycli plugin uninstall my-plugin
toycli plugin install github:user/toycli-plugin-my-plugin
```

安装或卸载 plugin 后，建议重新打开一个终端，确保启动时重新发现命令。

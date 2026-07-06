# 声明 Realtime Listener（adapter manifest 侧）

本文档只讲一件事：在 adapter 的 `cli({...})` 里声明 `listeners[]`，让 `opencli listener start --listener <id>` 能发现并描述你的实时流。

消费侧（启动 / 流式 / HTTP API / 事件类型）见 `skills/opencli-listener/SKILL.md`。本文不重复。

---

## 什么时候声明 listener

只有当目标页**在加载后仍持续产出数据**时才声明。比如：

- 直播间弹幕 / 评论流（`comment/info` 接口反复 POST）
- 滚动订单簿 / 实时成交（轮询或 SSE）
- feed 列表的 DOM 不断 append 新 item

如果数据加载一次就完事，用普通 adapter 命令一次 `func` 取走即可，**不要**做成 listener——它会占住一个 tab、占住 daemon 的 ring buffer，毫无收益。

先在交互式 shell 里验证数据确实持续到达：

```bash
opencli browser b open "<url>"
opencli browser b wait time 5
opencli browser b network --filter "<关键字>"     # 应能看到新的条目
```

确认持续产出后再回来写 listener。

---

## `listeners[]` 字段 schema

挂在 `BaseCliCommand.listeners`（`src/registry.ts`）。一个 adapter 可声明多个 listener，每个：

```typescript
interface ListenerDeclaration {
  /** 在该 adapter 内唯一且稳定的 id。用作路由 key + CLI --listener 的值。 */
  id: string;
  /** 观察源。CLI 表面只放行 'network' | 'dom'；schema 也允许 'cdp' | 'console'（预留）。 */
  source: 'network' | 'dom' | 'cdp' | 'console';
  /** source=network：URL 子串匹配，如 "comment/info"。省略=匹配所有响应。 */
  pattern?: string;
  /** source=dom：要观察的 CSS 选择器。 */
  selector?: string;
  /** source=dom：MutationObserver options 覆盖。默认 {childList:true, subtree:true}。 */
  mutationOptions?: { childList?: boolean; subtree?: boolean; characterData?: boolean; attributes?: boolean };
  /** 人类可读描述，`opencli listener list <site>` 会展示。必填，否则发现体验很差。 */
  description?: string;
  /** 可选的"输出形状"提示（仅文档用途，daemon 不校验）。给消费者一个 data 字段速查。 */
  outputSchema?: Record<string, string>;
}
```

与 adapter 其余字段（`site`/`name`/`columns`/`func`）并存。listener 声明**不**绑定某个 `func`——监听器是被扩展端持续观察的，`func` 是一次性命令。一个 adapter 可以同时有普通命令和 listener 声明。

---

## 完整示例

```javascript
import { cli } from '@jackwener/opencli/registry';

cli({
  site: 'buyin',
  name: 'live-products',
  access: 'read',
  strategy: 'COOKIE',
  domain: 'buyin.jinritemai.com',
  args: [],
  columns: [],
  func: async () => [],   // 一次性命令（可为空）
  listeners: [
    {
      id: 'comments',
      source: 'network',
      pattern: 'comment/info',
      description: 'Real-time live-stream comment stream',
      outputSchema: {
        comment_id: 'string',
        text: 'string',
        user_id: 'string',
        ts: 'number (epoch ms)',
      },
    },
    {
      id: 'feed-dom',
      source: 'dom',
      selector: '.live-feed .item',
      description: 'DOM feed item appends',
      mutationOptions: { childList: true, subtree: false },
    },
  ],
});
```

---

## 选 source

| source | 适用 | 触发条件 | 注意 |
|--------|------|----------|------|
| `network` | 数据来自一个会被反复调用的 JSON 接口 | 响应 URL 含 `pattern` 子串 | `pattern` 用最短能唯一定位的子串（`comment/info`），别写整个 query string |
| `dom` | 数据是页面 append 到列表里、且没有稳定接口 | `selector` 命中的子树发生 MutationObserver 变更 | 默认 `childList+subtree`；元素自身被替换不会触发，要观察属性变化显式开 `attributes` |
| `cdp` / `console` | 预留 | CLI 目前只放行 `network`/`dom`；想用这两个需直接走 daemon HTTP | 不要在公开 adapter 里声明，消费者跑不起来 |

---

## 消费侧调用如何回填到声明

`opencli listener start --site buyin --adapter live-products --listener comments ...` 时：

1. daemon 用 `<site>/<adapter>:<listenerId>` 做 dedup key（不查 manifest，纯信任 CLI 参数）。
2. 扩展端按 `source` 分发：
   - `network` → 在该 tab 上挂 CDP body 拦截，URL 含 `pattern` 即推送 `data` 事件
   - `dom` → 注入 MutationObserver 观察 `selector`，按 `mutationOptions` 触发
3. 事件流回 daemon EventBus，per-`listenerId` ring buffer（1000 条），消费者经 SSE/`history` 取走。

也就是说：**manifest 的 `listeners[]` 只是发现 + 描述的契约，daemon 不用它做路由**。但如果你不声明，`opencli listener list` 就没有 description，下游 agent 也不知道这个 adapter 能听什么。因此**公开 adapter 必须声明**，私人 adapter 强烈建议声明。

---

## 验证 listener-enabled adapter

`opencli browser verify <site>/<name>` 目前只验证 `func` 一次命令，**不**启动 listener。listener 要单独验证：

```bash
# 1. 先确认扩展+daemon 通
opencli doctor

# 2. 站点侦察确认 endpoint 持续产出（见上文 wait→network 流程）

# 3. 启动 listener，看 status 进入 running
opencli listener start --site <site> --adapter <adapter> \
  --listener <id> --source <network|dom> \
  [--pattern ... | --selector ...] --url <page-url>
opencli listener list                       # 应看到该 listener，status=running

# 4. 在该 tab 上手动触发一次数据产出（刷新 / 发评论 / 等 5s）
#    然后 history 应非空
opencli listener history --listener <id>

# 5. stream 一把，确认 data 事件 JSON 结构跟 outputSchema 对得上
opencli listener stream --listener <id>     # 5~10s 后 Ctrl-C

# 6. 收尾
opencli listener stop --site <site> --adapter <adapter> --listener <id>
```

肉眼核对 `history` 里一条事件的 `data` 字段和 `outputSchema` 是否一致；不一致就回 adapter 改 `outputSchema`（schema 只是文档，不会假装校验，错了消费者会按错形状写下游逻辑）。

---

## 常见错配

| 现象 | 原因 | 修法 |
|------|------|------|
| `listener list` 显示该 listener 但 description 空 | 没写 `description` | 补上，`opencli listener list` 是 agent 发现入口 |
| 启动了但 `history` 永 `[]` | `pattern`/`selector` 没命中页面真实产出 | 先 `opencli browser <s> network` 看真实 URL；DOM 类用 `browser find --css <sel>` 验证选择器 |
| `outputSchema` 跟实际 event.data 对不上 | 抄了旧接口字段 / 站点换版 | 用 `history` 抓一条 raw event，照着修 schema |
| 同一 id 起第二次得到 `already-running` 而非新 stream | 1 个 listenerId 只允许 1 个活动实例（dedup） | 要换页就 `restart`，要并列就换 `id` |
| 公开 adapter 里声明了 `cdp`/`console` | CLI `start` 只放行 network/dom | 暂移除，等 CLI 放行后再加 |

---

## 与站点记忆的回写

按 `site-memory.md` 的 schema，新增 listener 后往 `~/.opencli/sites/<site>/notes.md` 顶部追加一段：

```
## YYYY-MM-DD by <agent>
- 新增 listener <id> (source=<network|dom>, pattern=<...>|selector=<...>)
- observed URL: <page-url>
- outputSchema 字段：<list>
- 验证：history N 条 / stream N 条对得上
```

`endpoints.json` 不需要为 listener 单独建条目——它观察的还是同一个 endpoint，只是改成持续模式。在对应 endpoint 的 `notes` 字段标注"支持 realtime listener (id=<id>)"即可。
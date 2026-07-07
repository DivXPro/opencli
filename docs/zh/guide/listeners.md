# 持续监听（Listener）

ToyCLI 支持对任意站点做持续实时监听：扩展在 Chrome 中拦截网络响应、DOM 变化或 CDP 事件，将事件以 `listener-event` 形式推送到 daemon 的 EventBus，外部应用通过 HTTP/SSE 订阅，数据按 `listenerId` 隔离，多个订阅者互不混淆。

## 架构

```
Chrome 扩展（监听网络/DOM/CDP + 标签页生命周期）
        │ WebSocket /ext
        ▼
ToyCLI Daemon（EventBus + ListenerManager）
        │ HTTP /listener/stream（SSE） / /listener/history
        ▼
外部应用（Wails / Python / shell / CLI）
```

## CLI 命令

```bash
# 启动监听
toycli listener start \
  --site buyin --adapter live-products \
  --listener comments --source network \
  --url https://buyin.jinritemai.com/dashboard/live/control

# 实时流（JSONL 输出到 stdout）
toycli listener stream --listener comments

# 获取历史
toycli listener history --listener comments --since 1700000000000

# 列出活跃
toycli listener list

# 停止
toycli listener stop --site buyin --adapter live-products --listener comments

# 重启
toycli listener restart --site buyin --adapter live-products --listener comments \
  --source network --url https://buyin.jinritemai.com/dashboard/live/control
```

## HTTP API（供外部应用订阅）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/listener/start` | 注册并启动监听 |
| POST | `/listener/stop` | 停止监听 |
| GET  | `/listener/stream?listenerId=...` | SSE 实时事件流 |
| GET  | `/listener/history?listenerId=...&since=...` | 历史（按时间过滤） |
| GET  | `/listener/status` | 当前所有监听状态 |

### 订阅示例（curl）

```bash
curl -N http://127.0.0.1:19825/listener/stream?listenerId=comments
```

### 订阅示例（Wails / Go）

```go
resp, _ := http.Get("http://127.0.0.1:19825/listener/stream?listenerId=comments")
scanner := bufio.NewScanner(resp.Body)
for scanner.Scan() {
    line := scanner.Text()
    if strings.HasPrefix(line, "data: ") {
        var event map[string]any
        json.Unmarshal([]byte(line[6:]), &event)
        runtime.EventsEmit(a.ctx, "listener-event", event)
    }
}
```

## 事件类型

| type | 含义 |
|------|------|
| `data` | 监听到的新数据 |
| `stopped` | 监听已停止（reason: tab-closed / browser-closed / user-stop / error） |
| `paused` | 监听暂停（reason: page-navigated） |
| `resumed` | 监听恢复 |
| `error` | 监听错误（error: 描述） |

## 适配器声明监听

在适配器的 `cli({...})` 调用中加 `listeners`：

```javascript
cli({
  site: 'buyin',
  name: 'live-products',
  listeners: [
    {
      id: 'comments',
      source: 'network',
      pattern: 'comment/info',
      description: '直播评论实时监听',
    },
  ],
  // ... 其他字段
});
```

## 标签页生命周期

扩展监听 `chrome.tabs.onRemoved`、`chrome.tabs.onUpdated`、`chrome.windows.onRemoved`：

- 用户关闭标签页 → 上报 `stopped` / `tab-closed`
- 页面导航到其他 URL → 上报 `paused` / `page-navigated`
- 用户关闭 Chrome 窗口 → 上报 `stopped` / `browser-closed`

外部应用收到 `stopped` 事件后可决定是否自动重连（`POST /listener/start` 会复用或重建标签）。

## 去重

同一 `site/adapter:listenerId` 同时只允许一个活跃监听。重复 `start` 不会创建第二个标签页，会返回 `already-running`。需要重启时用 `toycli listener restart`。

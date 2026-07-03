# Realtime Listeners

OpenCLI supports continuous realtime monitoring of any site: the Chrome extension intercepts network responses, DOM mutations, or CDP events, pushes them as `listener-event` messages to the daemon's EventBus, and external apps subscribe via HTTP/SSE. Data is isolated per `listenerId` — multiple subscribers never see each other's data.

## Architecture

```
Chrome Extension (network/DOM/CDP listeners + tab lifecycle)
        │ WebSocket /ext
        ▼
OpenCLI Daemon (EventBus + ListenerManager)
        │ HTTP /listener/stream (SSE) / /listener/history
        ▼
External Apps (Wails / Python / shell / CLI)
```

## CLI Commands

```bash
# Start a listener
opencli listener start \
  --site buyin --adapter live-products \
  --listener comments --source network \
  --url https://buyin.jinritemai.com/dashboard/live/control

# Stream events in real time (JSONL to stdout)
opencli listener stream --listener comments

# Get buffered history
opencli listener history --listener comments --since 1700000000000

# List active listeners
opencli listener list

# Stop a listener
opencli listener stop --site buyin --adapter live-products --listener comments

# Restart (stop + start)
opencli listener restart --site buyin --adapter live-products --listener comments \
  --source network --url https://buyin.jinritemai.com/dashboard/live/control
```

## HTTP API (for external app subscriptions)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/listener/start` | Register and start a listener |
| POST | `/listener/stop` | Stop a listener |
| GET  | `/listener/stream?listenerId=...` | SSE realtime event stream |
| GET  | `/listener/history?listenerId=...&since=...` | History (time-filtered) |
| GET  | `/listener/status` | Current listener states |

### Subscription example (curl)

```bash
curl -N http://127.0.0.1:19825/listener/stream?listenerId=comments
```

### Subscription example (Wails / Go)

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

## Event Types

| type | Meaning |
|------|---------|
| `data` | New data captured by the listener |
| `stopped` | Listener stopped (reason: tab-closed / browser-closed / user-stop / error) |
| `paused` | Listener paused (reason: page-navigated) |
| `resumed` | Listener resumed |
| `error` | Listener error (error: description) |

## Declaring Listeners in an Adapter

Add a `listeners` field to the adapter's `cli({...})` call:

```javascript
cli({
  site: 'buyin',
  name: 'live-products',
  listeners: [
    {
      id: 'comments',
      source: 'network',
      pattern: 'comment/info',
      description: 'Real-time live comment listener',
    },
  ],
  // ... other fields
});
```

## Tab Lifecycle

The extension monitors `chrome.tabs.onRemoved`, `chrome.tabs.onUpdated`, and `chrome.windows.onRemoved`:

- User closes the tab → emits `stopped` / `tab-closed`
- Page navigates to another URL → emits `paused` / `page-navigated`
- User closes Chrome window → emits `stopped` / `browser-closed`

External apps can decide whether to auto-reconnect after receiving a `stopped` event (`POST /listener/start` reuses or creates a tab).

## Deduplication

At most one active listener is allowed per `site/adapter:listenerId`. A duplicate `start` will not create a second tab — it returns `already-running`. Use `opencli listener restart` to restart.

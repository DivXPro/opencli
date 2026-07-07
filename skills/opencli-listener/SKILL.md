---
name: toycli-listener
description: Use when an agent needs to subscribe to realtime page events — live comments, order feeds, continuously updating lists, DOM mutations, or any data a page pushes after load. Covers `toycli listener start/stop/list/status/history/stream/restart`, the daemon `/listener/*` HTTP+SSE API, event types, tab-lifecycle stops, and the per-listenerId dedup model. For declaring listeners inside an adapter manifest, see toycli-adapter-author instead; for one-shot page inspection use toycli-browser.
allowed-tools: Bash(toycli:*), Read
---

# toycli-listener

Realtime listeners turn a page from a one-shot scrape into a continuous event stream. The Chrome extension intercepts network responses / DOM mutations / CDP events, pushes them as `listener-event` messages to the daemon's EventBus, and external apps (CLI, Wails, Python, shell) subscribe per `listenerId`. Data is isolated per listenerId — subscribers never see each other's traffic.

This skill is for **consuming** listeners. If you are building a reusable adapter under `clis/<site>/` and want it to *expose* a listener, see `toycli-adapter-author` (it documents the `listeners` manifest field). For a single inspection of what a page is doing, `toycli browser network` in `toycli-browser` is cheaper than standing up a listener.

## When to use a listener vs `browser network`

- **Listener** — the page keeps emitting data after load (live comments, rolling order book, push feed, in-place DOM appends). You want every event, streamed, for minutes/hours.
- **`browser network`** — one-shot snapshot of what the page already fetched. Cheaper, no daemon state, no SSE. Use this first to confirm the endpoint exists; only escalate to a listener when you've confirmed the data keeps arriving.

## Architecture

```
Chrome Extension (network / DOM / CDP listeners + tab lifecycle)
        │ WebSocket /ext
        ▼
ToyCLI Daemon (EventBus per-listenerId ring buffer + ListenerManager dedup)
        │ HTTP /listener/stream (SSE) · /listener/history · /listener/status
        ▼
External Apps (toycli listener stream · curl · Wails · Python · shell)
```

- The daemon buffers the last 1000 events per `listenerId` in a ring. New subscribers get history via `/listener/history`, then live events via `/listener/stream`.
- `listenerId` is the routing key. It is scoped to one adapter, and one active listener max per `site/adapter:listenerId` (dedup — see below).

## Prerequisites

```bash
toycli doctor
```

Same as `toycli-browser`: daemon green + extension installed + Chrome running. Listeners do not work with `PUBLIC` / `LOCAL` adapters — they need the live browser. The `--url` page must be one you can already drive (logged in if the site requires it).

---

## CLI commands

The `listener` group is a top-level command group, peer to `browser` / `external` / `plugin`.

```bash
# Start a listener — opens (or reuses) a tab at --url and begins observing
toycli listener start \
  --site buyin --adapter live-products \
  --listener comments --source network \
  --url https://buyin.jinritemai.com/dashboard/live/control
# optional: --pattern "comment/info"   (network: URL substring to match)
# optional: --selector ".comment-list" (dom: CSS selector to observe)

# Stream events to stdout as JSONL (SSE) — blocks until you stop / listener dies
toycli listener stream --listener comments

# Print buffered history (no live tail) — useful to inspect without holding a stream
toycli listener history --listener comments
toycli listener history --listener comments --since 1700000000000   # epoch ms

# List ACTIVE listeners only
toycli listener list
# Show ALL listener states (active + stopped)
toycli listener status

# Stop a listener
toycli listener stop --site buyin --adapter live-products --listener comments

# Restart (stop + start) — use to refresh a stale tab or change --url
toycli listener restart --site buyin --adapter live-products \
  --listener comments --source network \
  --url https://buyin.jinritemai.com/dashboard/live/control
```

### Required flags

| flag | applies to | meaning |
|------|-----------|---------|
| `--site` | start/stop/restart | adapter site (e.g. `buyin`) |
| `--adapter` | start/stop/restart | adapter name (e.g. `live-products`) |
| `--listener <id>` | all | the listener id from the adapter manifest |
| `--source` | start/restart | `network` or `dom` (CLI surface; manifest schema also allows `cdp`/`console`) |
| `--url` | start/restart | page URL to observe — the extension opens/reuses a tab here |
| `--pattern` | start/restart (network) | URL substring to match, e.g. `comment/info` |
| `--selector` | start/restart (dom) | CSS selector to observe |
| `--since <ms>` | history | epoch-ms filter; only events after this timestamp |

### Mental model

1. **One page, one observer.** `--url` is the page the listener watches. For `network` source, `--pattern` narrows which responses get emitted (substring match on the request URL). For `dom` source, `--selector` picks the subtree; MutationObserver options come from the manifest's `mutationOptions` (defaults: childList + subtree).
2. **`listenerId` is the routing key.** It must match the `id` of a `listeners[]` entry in the adapter manifest — that's what makes `toycli listener start --listener <id>` discoverable. If you start a listener without a matching manifest entry it still runs (the manifest is documentation + discovery, the daemon trusts the CLI args), but `toycli listener list` won't show a helpful description.
3. **`stream` blocks.** It's an SSE subscription. In a script, pipe it: `toycli listener stream --listener comments | while read line; do ...; done`. In an agent, prefer `history` for bounded inspection and `stream` only when you genuinely need the tail.
4. **History is bounded.** The daemon keeps the last 1000 events per `listenerId`. If you need more, drain `stream` yourself.

---

## HTTP/SSE API (for external app subscriptions)

Daemon listens on `127.0.0.1:19825`. The same surface the CLI uses; useful for Wails/Electron/Python backends that want their own event loop.

| Method | Path | Body / Query | Returns |
|--------|------|--------------|---------|
| POST | `/listener/start` | JSON: `{site, adapter, listenerId, source, url, pattern?, selector?, mutationOptions?, contextId?, session?}` | `202 {ok, status:'starting', key, state}` · `200 {ok, status:'already-running', key, state}` on dedup · `503/409` if extension not connected |
| POST | `/listener/stop` | JSON: `{site, adapter, listenerId, reason?, contextId?}` | `200 {ok, status:'stopped'}` · `404 {ok:false, error:'listener not found'}` |
| GET | `/listener/status` | `?active=0` to include stopped | `200 {ok, listeners: ListenerState[]}` |
| GET | `/listener/history` | `?listenerId=...&since=<epochMs>` | `200 {ok, events: ListenerEvent[]}` · `400` if no listenerId |
| GET | `/listener/stream` | `?listenerId=...` | `text/event-stream`; first an `event: hello` with `{subscriberId, listenerId}`, then a `data: <json>` line per event |

### curl (quickest smoke)

```bash
# start (extension must be connected)
curl -X POST http://127.0.0.1:19825/listener/start \
  -H 'X-ToyCLI: 1' -H 'Content-Type: application/json' \
  -d '{"site":"buyin","adapter":"live-products","listenerId":"comments","source":"network","url":"https://buyin.jinritemai.com/dashboard/live/control","pattern":"comment/info"}'

# stream
curl -N http://127.0.0.1:19825/listener/stream?listenerId=comments
```

> `X-ToyCLI` is a required custom header on POST endpoints (CSRF guard — browsers can't send it without a CORS preflight, which the daemon denies). The SSE `/stream` endpoint does not require the header (it sets `Access-Control-Allow-Origin` to the chrome-extension origin or `null`).

### Wails / Go

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

### Python

```python
import requests
r = requests.get("http://127.0.0.1:19825/listener/stream",
                 params={"listenerId": "comments"}, stream=True)
for line in r.iter_lines():
    if line and line.startswith(b"data: "):
        import json
        evt = json.loads(line[6:])
        print(evt)
```

---

## Event types

Every event is a `ListenerEvent`: `{listenerId, adapterKey, type, data?, reason?, error?, tabId?, timestamp}`.

| `type` | when | fields |
|--------|------|--------|
| `data` | a new network response matched `--pattern`, or a DOM mutation matched `--selector` | `data` (the captured payload) |
| `stopped` | listener ended | `reason`: `tab-closed` \| `browser-closed` \| `page-navigated` \| `user-stop` \| `error` |
| `paused` | page navigated away but tab still alive | `reason: page-navigated` |
| `resumed` | listener resumed after a pause | — |
| `error` | listener errored (selector detached, CDP lost, etc.) | `error` (message) |

Subscribe to **all** of them, not just `data`. A robust consumer treats `stopped` as a reconnect signal (`POST /listener/start` again — it reuses or creates the tab) and `paused`/`resumed` as transient.

## Tab lifecycle (why listeners stop)

The extension monitors `chrome.tabs.onRemoved`, `chrome.tabs.onUpdated`, `chrome.windows.onRemoved`:

- User closes the tab → `stopped` / `tab-closed`
- Page navigates to another URL → `paused` / `page-navigated` (when you navigate back, `resumed` fires; otherwise the listener eventually stops)
- User closes the Chrome window → `stopped` / `browser-closed`

External apps decide whether to auto-reconnect on `stopped` — `POST /listener/start` is idempotent (returns `already-running` if something is still up, otherwise opens a fresh tab).

## Deduplication

At most one active listener per `site/adapter:listenerId`. A second `start` with the same key does **not** open a second tab — the daemon returns `status: 'already-running'` and points at the existing `ListenerState`. To force a refresh, use `toycli listener restart` (stop + start), or `stop` then `start` with a new `--url`.

This is per-listenerId, not per-page: two different listenerIds on the same adapter can run simultaneously and each gets its own buffer + stream.

---

## Recipes

### Confirm a page keeps emitting, then attach a listener

```bash
# 1. one-shot: which endpoint does the page hit?
toycli browser b open "https://buyin.jinritemai.com/dashboard/live/control"
toycli browser b network --filter "comment"
# -> find the comment/info request, note the URL substring

# 2. confirm it fires more than once (live)
toycli browser b wait time 5
toycli browser b network --filter "comment"      # should show new entries

# 3. only now escalate to a listener
toycli listener start --site buyin --adapter live-products \
  --listener comments --source network --pattern "comment/info" \
  --url "https://buyin.jinritemai.com/dashboard/live/control"
toycli listener stream --listener comments
```

### Bounded history inspection (no live tail)

```bash
toycli listener start ...                                   # leave it running
# ... some time later, agent wants to reason over what happened ...
toycli listener history --listener comments                 # last 1000 events
toycli listener history --listener comments --since $(date +%s%3N)   # only this minute
```

### Watch a DOM list that appends items

```bash
toycli listener start --site foo --adapter feed --listener items \
  --source dom --selector ".feed-item" \
  --url "https://foo.com/feed"
toycli listener stream --listener items
```

The manifest's `mutationOptions` controls what triggers a `data` event (default `childList + subtree`). If you see no events, the page may be appending into a child node the default subtree covers — click around or check the adapter's `listeners[]` declaration.

### Recover from a `stopped` event

```bash
# in your consumer loop:
#  on event.type === 'stopped':
curl -X POST http://127.0.0.1:19825/listener/start \
  -H 'X-ToyCLI: 1' -H 'Content-Type: application/json' \
  -d '{"site":"...","adapter":"...","listenerId":"...","source":"network","url":"...","pattern":"..."}'
```

---

## Pitfalls

- **`--source` on the CLI is effectively `network|dom`.** The manifest schema allows `cdp`/`console` for future sources, but the CLI `start` command casts to `'network' | 'dom'`. Don't try `--source cdp` from the CLI.
- **`already-running` is not an error.** It means your `start` was a no-op. If you actually wanted a fresh tab, `restart` instead.
- **History is capped at 1000 events per listenerId.** Long-running feeds will evict the oldest. If you need a complete log, drain `stream` to a file.
- **`stream` holds a connection open.** In an agent, an unbounded `stream` command will block forever — wrap it with a timeout or pipe to a consumer that exits.
- **Don't assume the manifest lists every listener.** `toycli listener start` works without a manifest entry (the daemon trusts your flags), but you lose the description in `list` and the discovery story. Adapter authors should declare listeners — see `toycli-adapter-author`.
- **The page must stay open.** Closing the tab / window stops the listener. If your consumer needs resilience, reconnect on `stopped` rather than treating it as fatal.

## Troubleshooting

| symptom | fix |
|---------|-----|
| `start` returns 503 / `extension_not_connected` | `toycli doctor` — Chrome not running or extension not installed |
| `start` returns `409 profile_required` | Multiple Browser Bridge profiles connected; pass `contextId` (CLI: `--profile`), same as browser commands |
| `stream` connects but no `data` events | `--pattern`/`--selector` doesn't match what the page emits; open the URL in a real tab and `toycli browser <s> network` to confirm the endpoint, then narrow `--pattern` |
| `stream` ends immediately | listener stopped — check `toycli listener status` for the `reason`; most likely `tab-closed` or `page-navigated` |
| `history` returns `[]` but you saw events earlier | older than the ring cap, or wrong `listenerId` (id is scoped to one adapter) |

## See also

- `toycli-adapter-author` — declaring `listeners[]` in an adapter manifest (network pattern / dom selector / mutationOptions / outputSchema).
- `toycli-browser` — one-shot `browser network` / `browser state` for inspecting a page before deciding to stand up a listener.
- `toycli-usage` — top-level map of all toycli command groups.
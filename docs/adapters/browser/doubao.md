# doubao

Browser adapter for [Doubao Chat](https://www.doubao.com/chat).

## Commands

| Command | Description |
|---------|-------------|
| `toycli doubao status` | Check whether the page is reachable and whether Doubao appears logged in |
| `toycli doubao new` | Start a new Doubao conversation |
| `toycli doubao send "..."` | Send a message to the current Doubao chat |
| `toycli doubao read` | Read the visible Doubao conversation |
| `toycli doubao ask "..."` | Send a prompt and wait for a reply |
| `toycli doubao detail <id>` | 对话详情 |
| `toycli doubao history` | 历史对话列表 |
| `toycli doubao meeting-summary <id>` | 会议总结 |
| `toycli doubao meeting-transcript <id>` | 会议记录 |

## Prerequisites

- Chrome is running
- You are already logged into [doubao.com](https://www.doubao.com/)
- Browser Bridge extension is installed and enabled for ToyCLI

## Examples

```bash
toycli doubao status
toycli doubao new
toycli doubao send "帮我总结这段文档"
toycli doubao read
toycli doubao ask "请写一个 Python 快速排序示例" --timeout 90
```

## Notes

- The adapter targets the web chat page at `https://www.doubao.com/chat`
- Doubao commands default to persistent site sessions, so consecutive `doubao ask` / `doubao read` / `doubao detail` invocations continue in the same Doubao page. Pass `--site-session ephemeral` for a one-shot tab.
- `new` first tries the visible "New Chat / 新对话" button, then falls back to the new-thread route
- `ask` uses DOM polling, so very long generations may need a larger `--timeout`

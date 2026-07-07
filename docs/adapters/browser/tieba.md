# Tieba

**Mode**: 🔐 Browser · **Domain**: `tieba.baidu.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli tieba hot` | Read Tieba trending topics |
| `toycli tieba posts <forum>` | List threads in one forum |
| `toycli tieba search <keyword>` | Search threads across Tieba |
| `toycli tieba read <thread-id>` | Read one thread page |

## Usage Examples

```bash
# Trending topics
toycli tieba hot --limit 5

# List forum threads
toycli tieba posts 李毅 --limit 10

# Search Tieba
toycli tieba search 编程 --limit 10

# Read one thread
toycli tieba read 10163164720 --limit 10

# Read page 2 of a thread
toycli tieba read 10163164720 --page 2 --limit 10

# JSON output
toycli tieba hot -f json
```

## Notes

- `tieba search` currently supports only `--page 1`
- `tieba read --limit` counts reply rows; page 1 may also include the main post

## Prerequisites

- Chrome running and able to open `tieba.baidu.com`
- [Browser Bridge extension](/guide/browser-bridge) installed
- For `posts`, `search`, and `read`, a valid Tieba login session in Chrome is recommended

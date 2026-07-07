# V2EX

**Mode**: 🌐 / 🔐 · **Domain**: `v2ex.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli v2ex hot` | Hot topics |
| `toycli v2ex latest` | Latest topics |
| `toycli v2ex topic <id>` | Topic detail |
| `toycli v2ex node <name>` | Topics by node |
| `toycli v2ex user <username>` | Topics by user |
| `toycli v2ex member <username>` | User profile |
| `toycli v2ex replies <id>` | Topic replies |
| `toycli v2ex nodes` | All nodes (sorted by topic count) |
| `toycli v2ex daily` | Daily hot |
| `toycli v2ex me` | My profile (auth required) |
| `toycli v2ex notifications` | My notifications (auth required) |

## Usage Examples

```bash
# Hot topics
toycli v2ex hot --limit 5

# Browse topics in a node
toycli v2ex node python

# View topic replies
toycli v2ex replies 1000

# User's topics
toycli v2ex user Livid

# User profile
toycli v2ex member Livid

# List all nodes
toycli v2ex nodes --limit 10

# JSON output
toycli v2ex hot -f json
```

## Prerequisites

Most commands (`hot`, `latest`, `topic`, `node`, `user`, `member`, `replies`, `nodes`) use the public V2EX API and **require no browser or login**.

For `daily`, `me`, and `notifications`:

- Chrome running and **logged into** v2ex.com
- [Browser Bridge extension](/guide/browser-bridge) installed

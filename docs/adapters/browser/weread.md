# 微信读书 (WeRead)

**Mode**: 🔐 Browser · **Domain**: `weread.qq.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli weread shelf` | List books on your bookshelf |
| `toycli weread search` | Search books on WeRead |
| `toycli weread book` | View book details |
| `toycli weread ranking` | Book rankings by category |
| `toycli weread notebooks` | List books that have highlights or notes |
| `toycli weread highlights` | List your highlights (underlines) in a book |
| `toycli weread notes` | List your notes (thoughts) on a book |

## Usage Examples

```bash
# View your bookshelf
toycli weread shelf --limit 20

# Search books
toycli weread search "三体"

# View book details
toycli weread book <book-id>

# Book rankings
toycli weread ranking --limit 10

# List books with notes/highlights
toycli weread notebooks

# View highlights for a book
toycli weread highlights <book-id>

# View your notes
toycli weread notes <book-id>

# JSON output
toycli weread shelf -f json
```

## Prerequisites

- Chrome running and **logged into** weread.qq.com
- [Browser Bridge extension](/guide/browser-bridge) installed

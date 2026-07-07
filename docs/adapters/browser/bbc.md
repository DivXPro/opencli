# BBC News

**Mode**: 🌐 Public · **Domain**: `bbc.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli bbc news` | Latest BBC News headlines (top stories) |
| `toycli bbc topic <topic>` | Latest headlines for a single BBC topic feed |

## Usage Examples

```bash
# Top stories
toycli bbc news --limit 5

# Topic-scoped feeds (RSS at feeds.bbci.co.uk/news/<topic>/rss.xml)
toycli bbc topic technology --limit 10
toycli bbc topic world --limit 20
toycli bbc topic business
toycli bbc topic science_and_environment

# JSON output
toycli bbc topic technology -f json
```

## Topics

Valid `<topic>` values:

| Topic slug | Feed |
|------------|------|
| `world` | World news |
| `business` | Business |
| `politics` | UK politics |
| `health` | Health |
| `education` | Education & family |
| `science_and_environment` | Science & environment |
| `technology` | Technology |
| `entertainment_and_arts` | Entertainment & arts |

Pass any other value and the adapter raises `ArgumentError` with the full list.

## Output Columns

| Command | Columns |
|---------|---------|
| `news` | (see existing news row schema) |
| `topic` | `rank, title, description, pubDate, url` |

## Prerequisites

- No browser required — uses the public BBC RSS feeds at `feeds.bbci.co.uk`.

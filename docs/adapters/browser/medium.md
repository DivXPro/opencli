# Medium

**Mode**: 🌗 Mixed · **Domain**: `medium.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli medium feed` | Get hot Medium posts, optionally scoped to a topic |
| `toycli medium search` | Search Medium posts by keyword |
| `toycli medium user` | Get recent articles by a user |
| `toycli medium tag <tag>` | Latest articles for a Medium tag (public RSS, no browser) |

## Usage Examples

```bash
# Get the general Medium feed
toycli medium feed --limit 10

# Search posts by keyword
toycli medium search ai

# Get articles by a user
toycli medium user @username

# Topic feed as JSON
toycli medium feed --topic programming -f json

# Latest articles for a tag (public RSS — fastest, no browser)
toycli medium tag programming --limit 10
toycli medium tag artificial-intelligence --limit 20
```

## `tag` columns

`rank, title, author, description, categories, published, url`

- `description` is the full RSS `<description>` (no silent truncation; pipe through `head` if you want a preview).
- `categories` is comma-joined Medium tags from each item's `<category>` blocks.
- `published` is the original `pubDate` ISO string when available.

## Prerequisites

- `toycli medium search` and `toycli medium tag` can run without a browser (the latter parses `medium.com/feed/tag/<tag>` RSS)
- `toycli medium feed` and `toycli medium user` require Browser Bridge access to `medium.com`

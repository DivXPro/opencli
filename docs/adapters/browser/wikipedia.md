# Wikipedia

**Mode**: 🌐 Public · **Domain**: `wikipedia.org`

## Commands

| Command | Description |
|---------|-------------|
| `toycli wikipedia search` | Search Wikipedia articles |
| `toycli wikipedia summary` | Get Wikipedia article summary |
| `toycli wikipedia random` | Random Wikipedia article |
| `toycli wikipedia trending` | Trending Wikipedia articles |
| `toycli wikipedia page <title>` | Full plain-text article extract (optional paragraph cap) |

## Usage Examples

```bash
# Search articles
toycli wikipedia search "quantum computing" --limit 10

# Get article summary
toycli wikipedia summary "Artificial intelligence"

# Get the full article body (plain text, no silent truncation)
toycli wikipedia page "Transformer (deep learning architecture)"

# Cap to first 3 paragraphs explicitly
toycli wikipedia page "Photosynthesis" --paragraphs 3

# Use with other languages
toycli wikipedia search "人工智能" --lang zh
toycli wikipedia page "人工智能" --lang zh --paragraphs 5

# JSON output
toycli wikipedia search "Rust" -f json
```

## Notes

- `summary` returns the lead-section blurb truncated to 300 chars (legacy convention)
- `page` returns the **complete** plain-text article body. Pass `--paragraphs N` to opt into a cap; default `0` means full article — no silent truncation

## Prerequisites

- No browser required — uses public Wikipedia API

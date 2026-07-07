# UISDC

**Mode**: 🌐 Public · **Domain**: `uisdc.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli uisdc news` | Latest AI/design industry news from 优设读报 |

## Usage Examples

```bash
# Latest UISDC news
toycli uisdc news --limit 20

# JSON output
toycli uisdc news --limit 10 -f json
```

## Notes

- Returns `rank`, `title`, `summary`, and stable article `url`.
- Invalid `--limit` values fail fast instead of being silently clamped.

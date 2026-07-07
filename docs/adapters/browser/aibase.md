# AIbase

**Mode**: 🌐 Public · **Domain**: `aibase.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli aibase news` | AIbase daily AI industry news |

## Usage Examples

```bash
# Latest AIbase daily news
toycli aibase news --limit 20

# JSON output
toycli aibase news --limit 10 -f json
```

## Notes

- Returns `rank`, `title`, and stable article `url`.
- Invalid `--limit` values fail fast instead of being silently clamped.

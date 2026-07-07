# Z-Library

**Mode**: 🔐 Browser · **Domain**: `z-library.im`

## Commands

| Command | Description |
|---------|-------------|
| `toycli zlibrary search <query>` | Search Z-Library books by title, author, ISBN, or keyword |
| `toycli zlibrary info <url>` | Read a Z-Library book page and list available PDF/EPUB download links |

## Usage Examples

```bash
# Search books
toycli zlibrary search "machine learning" --limit 5

# Get book download formats from a result URL
toycli zlibrary info "https://z-library.im/book/..."

# JSON output
toycli zlibrary search "9780131103627" -f json
```

## Prerequisites

- Chrome running and logged in to `z-library.im` if the page requires authentication.
- [Browser Bridge extension](/guide/browser-bridge) installed.

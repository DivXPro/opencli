# Pixiv

**Mode**: 🔐 Browser · **Domain**: `www.pixiv.net`

## Commands

| Command | Description |
|---------|-------------|
| `toycli pixiv ranking` | Daily/weekly/monthly illustration rankings |
| `toycli pixiv search <query>` | Search illustrations by keyword or tag |
| `toycli pixiv user <uid>` | View artist profile info |
| `toycli pixiv illusts <user-id>` | List illustrations by artist |
| `toycli pixiv detail <id>` | View illustration details |
| `toycli pixiv download <illust-id>` | Download original-quality images |

## Output Columns

| Command | Columns |
|---------|---------|
| `ranking` | `rank, title, author, user_id, illust_id, pages, bookmarks, url` |
| `search` | `rank, title, author, user_id, illust_id, pages, bookmarks, tags, url` |
| `illusts` | `rank, title, illust_id, pages, bookmarks, tags, created, url` |
| `user` | `user_id, name, premium, following, illusts, manga, novels, comment, url` |
| `detail` | `illust_id, title, author, type, pages, bookmarks, likes, views, tags, created, url` |

`illust_id` round-trips from `ranking` / `search` / `illusts` into `detail` / `download`. `user_id` round-trips from `ranking` / `search` into `user` / `illusts`.

## Usage Examples

### Ranking

```bash
# Daily rankings (default)
toycli pixiv ranking --limit 10

# Weekly / monthly rankings
toycli pixiv ranking --mode weekly
toycli pixiv ranking --mode monthly

# R18 rankings
toycli pixiv ranking --mode daily_r18
toycli pixiv ranking --mode weekly_r18

# Other modes: rookie, original, male, female
toycli pixiv ranking --mode rookie
```

### Search

```bash
# Search by keyword or tag
toycli pixiv search "初音ミク" --limit 20

# Filter by content rating
toycli pixiv search "風景" --mode safe       # Safe-for-work only
toycli pixiv search "風景" --mode r18        # R18 only
toycli pixiv search "風景" --mode all        # All (default)

# Sort by popularity
toycli pixiv search "VOCALOID" --order popular_d

# All sort options: date_d (newest), date (oldest), popular_d, popular_male_d, popular_female_d

# Pagination
toycli pixiv search "オリジナル" --page 2 --limit 30
```

### User & Illustrations

```bash
# View artist profile
toycli pixiv user 11

# List artist's illustrations (newest first)
toycli pixiv illusts 11 --limit 10

# View illustration details (tags, stats, type)
toycli pixiv detail 12345678
```

### Download

```bash
# Download all images from an illustration
toycli pixiv download 12345678

# Download to a custom directory
toycli pixiv download 12345678 --output ./my-images
```

### Output Formats

```bash
# JSON output
toycli pixiv ranking -f json

# Verbose mode
toycli pixiv search "test" -v
```

## Prerequisites

- Chrome running and **logged into** pixiv.net
- [Browser Bridge extension](/guide/browser-bridge) installed

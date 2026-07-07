# Xiaohongshu (小红书)

**Mode**: 🔐 Browser · **Domain**: `xiaohongshu.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli xiaohongshu search` | Search notes by keyword (returns title, author, likes, URL) |
| `toycli xiaohongshu ask` | Ask 点点 and return its answer with citation sources (`sources[]` in JSON) |
| `toycli xiaohongshu note` | Read full note content (title, author, description, likes, collects, comments, tags) |
| `toycli xiaohongshu comments` | Read comments from a note (`--with-replies` for nested 楼中楼 replies) |
| `toycli xiaohongshu feed` | Home feed recommendations (reads the hydrated Pinia store; URLs carry `xsec_token` for drill-down) |
| `toycli xiaohongshu notifications` | User notifications (mentions, likes, connections) |
| `toycli xiaohongshu user` | Get public notes from a user profile |
| `toycli xiaohongshu saved` | List saved/collected notes (`/user/profile/<id>?tab=fav&subTab=note`) |
| `toycli xiaohongshu liked` | List liked notes (`/user/profile/<id>?tab=liked&subTab=note`) |
| `toycli xiaohongshu download` | Download images and videos from a note |
| `toycli xiaohongshu publish` | Publish image-text notes (creator center UI automation) |
| `toycli xiaohongshu delete-note` | Verify or delete a published creator-center note by exact note ID |
| `toycli xiaohongshu follow` | Follow a user from the profile UI and verify the button state flips |
| `toycli xiaohongshu unfollow` | Unfollow a user from the profile UI, confirm the modal, and verify the button state flips |
| `toycli xiaohongshu creator-notes` | Creator's note list with per-note metrics |
| `toycli xiaohongshu creator-note-detail` | Detailed analytics for a single creator note |
| `toycli xiaohongshu creator-notes-summary` | Combined note list + detail analytics summary |
| `toycli xiaohongshu creator-profile` | Creator account info (followers, growth level) |
| `toycli xiaohongshu creator-stats` | Creator data overview (views, likes, collects, trends) |

## Usage Examples

```bash
# Search for notes
toycli xiaohongshu search 美食 --limit 10

# Ask 点点 and keep the citation audit trail
toycli xiaohongshu ask "上海露营需要注意什么？" -f json

# Read a note's full content (pass URL from search results to preserve xsec_token)
toycli xiaohongshu note "https://www.xiaohongshu.com/search_result/<id>?xsec_token=..."

# Read comments with nested replies (楼中楼)
toycli xiaohongshu comments "https://www.xiaohongshu.com/search_result/<id>?xsec_token=..." --with-replies --limit 20

# JSON output
toycli xiaohongshu search 旅行 -f json

# Other commands
toycli xiaohongshu feed
toycli xiaohongshu saved --limit 20
toycli xiaohongshu liked --limit 20
toycli xiaohongshu saved "https://www.xiaohongshu.com/user/profile/<id>?tab=fav&subTab=note"
toycli xiaohongshu liked "https://www.xiaohongshu.com/user/profile/<id>?tab=liked&subTab=note"
toycli xiaohongshu notifications
toycli xiaohongshu download "https://www.xiaohongshu.com/search_result/<id>?xsec_token=..."
toycli xiaohongshu download "https://xhslink.com/..."

# Publish an ordinary image-text note
toycli xiaohongshu publish "正文内容" --title "标题" --images ./a.jpg,./b.png

# Publish a text-image note; split multiple cards with ||| and use \n for card line breaks
toycli xiaohongshu publish "正文内容" --title "标题" --card-text "第一张\\n第二行|||第二张" --card-style 边框

# Follow / unfollow a profile
toycli xiaohongshu follow 5d8f88dc0000000001005d3a
toycli xiaohongshu unfollow https://www.xiaohongshu.com/user/profile/5d8f88dc0000000001005d3a

# Verify a published creator note without deleting it (default dry-run)
toycli xiaohongshu delete-note 6a08ba0b000000000702a893

# Actually delete after the target row and delete action are verified
toycli xiaohongshu delete-note 6a08ba0b000000000702a893 --execute
```

> Note: `note` and `comments` now require a full signed note URL with `xsec_token`. `download` accepts either a signed note URL or an `xhslink` short link. Bare note IDs are no longer reliable on xiaohongshu.
> `ask` is separate from ordinary `search`: it submits the question to 点点, returns `answer`, `source_count`, and `sources[]`, and keeps `xsec_token` in JSON when Xiaohongshu returns one. The current 点点 source API may return bare note IDs without `xsec_token`; in that case `url` falls back to `/explore/<note_id>` and `xsec_token` is an empty string. Each source also carries the engagement and identity metadata 点点 returns: `like_count`, `note_type` (`normal`/`video`), `user_id`, and `published_at` (each omitted when 点点 does not provide it), so citation analysis can read likes and note format without a follow-up `search`/`note` round-trip.
> `delete-note` operates in creator center and accepts a 24-character note ID or exact Xiaohongshu note URL; it defaults to dry-run verification and only deletes with `--execute`.
> `follow` and `unfollow` are write commands on the public profile page. They verify the browser stayed on the requested `/user/profile/<id>` target before clicking, and verify the visible follow-state button after the action.
> `publish --card-text` uses creator-center 文字配图. It requires generated card images to appear in the current composer before filling title/body or submitting. If you request `--card-style`, that exact live page style must be selected; unavailable styles fail instead of silently falling back.

## Prerequisites

- Chrome running and **logged into** xiaohongshu.com
- [Browser Bridge extension](/guide/browser-bridge) installed

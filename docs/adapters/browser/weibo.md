# Weibo (微博)

**Mode**: 🔐 Browser · **Domain**: `weibo.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli weibo hot` | 微博热搜 |
| `toycli weibo search` | Search Weibo posts by keyword |
| `toycli weibo feed` | 首页时间线（`for-you` / `following`） |
| `toycli weibo user` | 用户信息 |
| `toycli weibo user-posts` | 按用户列出微博，可选日期范围 |
| `toycli weibo me` | 我的信息 |
| `toycli weibo post` | 读取单条微博 |
| `toycli weibo favorites` | 我的微博收藏列表 |
| `toycli weibo publish` | 通过网页 UI 直接发布微博，支持最多 9 张图片 |
| `toycli weibo delete` | 删除登录账号自己的单条微博 |
| `toycli weibo comments` | 微博评论 |

## Usage Examples

```bash
# Quick start
toycli weibo hot --limit 5

# JSON output
toycli weibo hot -f json

# Search
toycli weibo search "OpenAI" --limit 5

# Home timeline (default: for-you / 推荐流)
toycli weibo feed --limit 10

# Following-only timeline (strict chronological following feed)
toycli weibo feed --type following --limit 10

# Read a post from feed/search using the emitted id
toycli weibo post <id>

# List a user's posts by uid or screen name
toycli weibo user-posts 1670458304 --start 2025-06-01 --end 2025-06-02 --limit 20

# Verbose mode
toycli weibo hot -v

# Favorites
toycli weibo favorites --limit 20

# Publish text (executes immediately)
toycli weibo publish "Hello from ToyCLI"

# Publish text with images (executes immediately)
toycli weibo publish "Hello with images" --images /path/a.jpg,/path/b.png

# Delete one of your own posts (executes immediately)
toycli weibo delete <id>
```

## Listing Columns

`feed`, `search`, and `user-posts` expose `id` for post rows. Pass that value
directly to `toycli weibo post <id>`. `hot` rows are search topics, not post
rows.

## Prerequisites

- Chrome running and **logged into** weibo.com
- [Browser Bridge extension](/guide/browser-bridge) installed

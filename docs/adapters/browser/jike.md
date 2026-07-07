# 即刻 (Jike)

**Mode**: 🔐 Browser · **Domain**: `web.okjike.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli jike feed` | 即刻首页动态流 |
| `toycli jike search` | 搜索即刻帖子 |
| `toycli jike post` | 帖子详情及评论 |
| `toycli jike topic` | 话题详情 |
| `toycli jike user` | 用户资料 |
| `toycli jike create` | 发布即刻动态 |
| `toycli jike comment` | 评论即刻帖子 |
| `toycli jike like` | 点赞即刻帖子 |
| `toycli jike repost` | 转发即刻帖子 |
| `toycli jike notifications` | 即刻通知 |

## Usage Examples

```bash
# View feed
toycli jike feed --limit 10

# Search posts
toycli jike search "AI" --limit 20

# View post details and comments
toycli jike post <post-id>

# Create a new post
toycli jike create --content "Hello Jike!"

# Like a post
toycli jike like <post-id>

# JSON output
toycli jike feed -f json
```

## Listing Columns

`feed`, `search`, and `user` expose `id` for each post row. Pass that value
directly to `toycli jike post <id>` for the detail view.

## Prerequisites

- Chrome running and **logged into** web.okjike.com
- [Browser Bridge extension](/guide/browser-bridge) installed

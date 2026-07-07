# 新浪博客 (Sina Blog)

**Mode**: 🌐 Public (search) / 🔐 Browser (hot, article, user) · **Domain**: `blog.sina.com.cn`

## Commands

| Command | Description |
|---------|-------------|
| `toycli sinablog hot` | 获取新浪博客热门文章/推荐 |
| `toycli sinablog search` | 搜索新浪博客文章（通过新浪搜索，无需浏览器） |
| `toycli sinablog article` | 获取新浪博客单篇文章详情 |
| `toycli sinablog user` | 获取新浪博客用户的文章列表 |

## Usage Examples

```bash
# 热门文章
toycli sinablog hot --limit 10

# 搜索文章（公开 API，无需浏览器）
toycli sinablog search "人工智能"

# 文章详情
toycli sinablog article "https://blog.sina.com.cn/s/blog_xxx.html"

# 用户文章列表
toycli sinablog user 1234567890 --limit 10

# JSON output
toycli sinablog hot -f json
```

## Prerequisites

- `search` command: No login required (public API)
- `hot`, `article`, `user` commands: Chrome with `blog.sina.com.cn` accessible, Browser Bridge extension installed

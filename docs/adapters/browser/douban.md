# 豆瓣 (Douban)

**Mode**: 🔐 Browser (Cookie) · **Domain**: `douban.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli douban search` | 搜索豆瓣电影、图书或音乐 |
| `toycli douban top250` | 豆瓣电影 Top 250 |
| `toycli douban subject` | 条目详情 |
| `toycli douban photos` | 获取电影海报/剧照图片列表 |
| `toycli douban download` | 下载电影海报/剧照图片 |
| `toycli douban marks` | 我的标记 |
| `toycli douban reviews` | 我的短评 |
| `toycli douban movie-hot` | 豆瓣电影热门榜单 |
| `toycli douban book-hot` | 豆瓣图书热门榜单 |

## Usage Examples

```bash
# 搜索电影
toycli douban search "流浪地球"

# 搜索图书
toycli douban search --type book "三体"

# 搜索音乐
toycli douban search --type music "周杰伦"

# 电影 Top 250
toycli douban top250 --limit 10

# 电影详情
toycli douban subject 1292052

# 图书详情
toycli douban subject 2567698 --type book
toycli douban subject 2567698 --type book -f json

# 获取海报直链（默认 type=Rb）
toycli douban photos 30382501 --limit 20

# 下载海报到本地目录
toycli douban download 30382501 --output ./douban

# 只下载指定 photo_id 的一张图
toycli douban download 30382501 --photo-id 2913621075 --output ./douban

# 返回 JSON，便于上层界面直接渲染图片并右键取图
toycli douban photos 30382501 -f json

# 电影热门
toycli douban movie-hot --limit 10

# 图书热门
toycli douban book-hot --limit 10

# JSON output
toycli douban top250 -f json
```

## Prerequisites

- Chrome logged into `douban.com`
- Browser Bridge extension installed

图书搜索和图书详情在稳定批量使用时默认需要已登录的豆瓣浏览器会话。

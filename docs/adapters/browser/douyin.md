# Douyin (抖音创作者中心)

**Mode**: 🔐 Browser · **Domain**: `creator.douyin.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli douyin profile` | 获取账号信息 |
| `toycli douyin videos` | 获取作品列表 |
| `toycli douyin drafts` | 获取草稿列表 |
| `toycli douyin draft` | 上传视频并保存为草稿 |
| `toycli douyin publish` | 定时发布视频到抖音 |
| `toycli douyin update` | 更新视频信息 |
| `toycli douyin delete` | 删除作品 |
| `toycli douyin stats` | 查询作品数据分析 |
| `toycli douyin collections` | 获取合集列表 |
| `toycli douyin activities` | 获取官方活动列表 |
| `toycli douyin location` | 搜索发布可用的地理位置 |
| `toycli douyin hashtag search` | 按关键词搜索话题 |
| `toycli douyin hashtag suggest` | 基于封面 URI 推荐话题 |
| `toycli douyin hashtag hot` | 获取热点词 |

## Usage Examples

```bash
# 账号与作品
toycli douyin profile
toycli douyin videos --limit 10
toycli douyin videos --status scheduled
toycli douyin drafts

# 发布前辅助信息
toycli douyin collections
toycli douyin activities
toycli douyin location "东京塔"
toycli douyin hashtag search "春游"
toycli douyin hashtag hot --limit 10

# 保存草稿
toycli douyin draft ./video.mp4 \
  --title "春游 vlog" \
  --caption "#春游 先存草稿"

# 定时发布
toycli douyin publish ./video.mp4 \
  --title "春游 vlog" \
  --caption "#春游 今天去看樱花" \
  --schedule "2026-04-08T12:00:00+09:00"

# 也支持 Unix 秒字符串
toycli douyin publish ./video.mp4 \
  --title "春游 vlog" \
  --schedule 1775617200

# 更新与删除
toycli douyin update 1234567890 --caption "更新后的文案"
toycli douyin update 1234567890 --reschedule "2026-04-09T20:00:00+09:00"
toycli douyin delete 1234567890

# JSON 输出
toycli douyin profile -f json
```

## Prerequisites

- Chrome running and **logged into** `creator.douyin.com`
- The logged-in account must have access to Douyin Creator Center publishing features
- [Browser Bridge extension](/guide/browser-bridge) installed

## Notes

- `publish` requires `--schedule` to be at least 2 hours later and no more than 14 days later
- `draft` and `publish` upload the video through Douyin/ByteDance browser-authenticated APIs, so cookies in the active browser session must be valid
- `hashtag suggest` expects a valid `cover`/`cover_uri` value produced during the publish pipeline; for normal manual use, `hashtag search` and `hashtag hot` are usually more convenient

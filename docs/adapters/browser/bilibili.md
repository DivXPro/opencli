# Bilibili

**Mode**: 🔐 Browser · **Domain**: `bilibili.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli bilibili hot` | |
| `toycli bilibili search` | |
| `toycli bilibili me` | |
| `toycli bilibili favorite` | Read your first favorite folder, or a specific folder with `--fid` |
| `toycli bilibili history` | |
| `toycli bilibili feed` | Read the following feed, or a specific user's dynamics by uid/name |
| `toycli bilibili feed-detail` | Read one dynamic in detail, including exclusive content |
| `toycli bilibili subtitle` | |
| `toycli bilibili video` | Get one video's metadata (title, author, duration, stats) by BV / URL / b23.tv link |
| `toycli bilibili summary` | Get the official AI video summary and timestamped outline by BV / URL / b23.tv link |
| `toycli bilibili comments` | Read top-level comments, or read replies under a top-level comment with `--parent` |
| `toycli bilibili comment` | Post a top-level comment or reply under a top-level comment (requires `--execute`) |
| `toycli bilibili dynamic` | |
| `toycli bilibili ranking` | |
| `toycli bilibili following` | |
| `toycli bilibili follow` | Follow a user by UID, profile URL, or resolvable name; verifies the relation after modify |
| `toycli bilibili unfollow` | Unfollow a user by UID, profile URL, or resolvable name; verifies the relation after modify |
| `toycli bilibili user-videos` | |
| `toycli bilibili download` | |

## Usage Examples

```bash
# Quick start
toycli bilibili hot --limit 5

# Search videos
toycli bilibili search 黑神话 --limit 10

# Read one creator's videos
toycli bilibili user-videos 2 --limit 10

# Follow / unfollow a creator
toycli bilibili follow 9617619
toycli bilibili unfollow https://space.bilibili.com/9617619

# Read your first favorite folder
toycli bilibili favorite --limit 10

# Read a specific favorite folder
toycli bilibili favorite --fid 123456789 --limit 10

# Read following feed
toycli bilibili feed --limit 10

# Read one user's dynamics by UID
toycli bilibili feed 2 --limit 10

# Read one user's dynamics by username and paginate
toycli bilibili feed 老番茄 --pages 2 --type video

# Read one dynamic in detail
toycli bilibili feed-detail 1234567890123456789

# Fetch subtitles
toycli bilibili subtitle BV1xx411c7mD --lang zh-CN

# Inspect one video's metadata
toycli bilibili video BV1xx411c7mD
toycli bilibili video https://www.bilibili.com/video/BV1xx411c7mD/

# Fetch the official AI summary for a video
toycli bilibili summary BV1xx411c7mD
toycli bilibili summary https://www.bilibili.com/video/BV1xx411c7mD/

# Read comments and a reply thread under a top-level rpid
toycli bilibili comments BV1xx411c7mD --limit 10
toycli bilibili comments BV1xx411c7mD --parent 123456789 --limit 10

# Post a comment or reply. The write only happens with --execute.
toycli bilibili comment BV1xx411c7mD "这条评论来自 ToyCLI" --execute
toycli bilibili comment BV1xx411c7mD "回复楼主" --parent 123456789 --execute

# JSON output
toycli bilibili hot -f json

# Verbose mode
toycli bilibili hot -v
```

## Prerequisites

- Chrome running and **logged into** bilibili.com
- [Browser Bridge extension](/guide/browser-bridge) installed

## Notes

- `toycli bilibili feed` without `uid` reads your following feed
- `toycli bilibili feed <uid-or-name>` reads a specific user's dynamics
- `toycli bilibili favorite` defaults to the first favorite folder when `--fid` is omitted
- `feed-detail` expects the dynamic ID from a `https://t.bilibili.com/<id>` URL
- `comments` emits `rpid`; pass a top-level row's `rpid` to `comments --parent` to read its reply thread
- `comments --limit` accepts `1..50`; empty comment lists raise `EmptyResultError`
- `comment` is a write command and refuses to post unless `--execute` is passed
- `comment --parent` expects the top-level/root `rpid`; nested reply-to-reply targeting is not inferred
- `follow` and `unfollow` are write commands; they no-op when the current relation already matches the requested state and otherwise re-read `/x/relation` after modify before reporting success
- `follow` and `unfollow` accept numeric UID, exact `space.bilibili.com/<uid>` profile URL, or a name that resolves through Bilibili search

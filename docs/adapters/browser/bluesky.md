# Bluesky

**Mode**: 🌐 Public · **Domain**: `bsky.app`

## Commands

| Command | Description |
|---------|-------------|
| `toycli bluesky profile` | User profile info |
| `toycli bluesky user` | Recent posts from a user |
| `toycli bluesky trending` | Trending topics |
| `toycli bluesky search` | Search users |
| `toycli bluesky feeds` | Popular feed generators |
| `toycli bluesky followers` | User's followers |
| `toycli bluesky following` | Accounts a user follows |
| `toycli bluesky thread` | Post thread with replies |
| `toycli bluesky starter-packs` | User's starter packs |

## Usage Examples

```bash
# User profile
toycli bluesky profile --handle bsky.app

# Recent posts
toycli bluesky user --handle bsky.app --limit 10

# Trending topics
toycli bluesky trending --limit 10

# Search users
toycli bluesky search --query "AI" --limit 10

# Popular feeds
toycli bluesky feeds --limit 10

# Followers / following
toycli bluesky followers --handle bsky.app --limit 10
toycli bluesky following --handle bsky.app

# Post thread with replies
toycli bluesky thread --uri "at://did:.../app.bsky.feed.post/..."

# Starter packs
toycli bluesky starter-packs --handle bsky.app

# JSON output
toycli bluesky profile --handle bsky.app -f json
```

## Prerequisites

None — all commands use the public Bluesky AT Protocol API, no browser or login required.

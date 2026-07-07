# YouTube

**Mode**: 🔐 Browser · **Domain**: `youtube.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli youtube search` | Search videos |
| `toycli youtube video` | Get video metadata |
| `toycli youtube transcript` | Get video transcript/subtitles |
| `toycli youtube comments` | Get video comments |
| `toycli youtube channel` | Get channel info and videos |
| `toycli youtube playlist` | Get playlist video list |
| `toycli youtube feed` | Homepage recommended videos |
| `toycli youtube history` | Watch history |
| `toycli youtube watch-later` | Watch Later queue |
| `toycli youtube subscriptions` | List subscribed channels |
| `toycli youtube like` | Like a video |
| `toycli youtube unlike` | Remove like from a video |
| `toycli youtube subscribe` | Subscribe to a channel |
| `toycli youtube unsubscribe` | Unsubscribe from a channel |

## Usage Examples

```bash
# Read commands
toycli youtube feed --limit 10
toycli youtube history --limit 20
toycli youtube watch-later --limit 50
toycli youtube subscriptions --limit 30

# Search and video info
toycli youtube search "rust programming" --limit 5
toycli youtube video "https://www.youtube.com/watch?v=xxx"
toycli youtube transcript "https://www.youtube.com/watch?v=xxx"

# Write commands (requires login)
toycli youtube like "https://www.youtube.com/watch?v=xxx"
toycli youtube unlike "videoId"
toycli youtube subscribe "@ChannelHandle"
toycli youtube unsubscribe "UCxxxxxxxxxxxxxx"
```

## Prerequisites

- Chrome running and **logged into** youtube.com
- [Browser Bridge extension](/guide/browser-bridge) installed

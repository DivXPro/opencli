# Twitter / X

**Mode**: 🔐 Browser · **Domain**: `twitter.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli twitter trending` | |
| `toycli twitter bookmarks` | |
| `toycli twitter profile` | |
| `toycli twitter search` | |
| `toycli twitter timeline` | |
| `toycli twitter thread` | |
| `toycli twitter following` | |
| `toycli twitter followers` | |
| `toycli twitter notifications` | |
| `toycli twitter device-follow` | Read the /i/timeline device-follow notification stream (tweets aggregated under a bell-icon "new posts from @userA and N others" notification) |
| `toycli twitter post` | |
| `toycli twitter reply` | |
| `toycli twitter delete` | |
| `toycli twitter like` | |
| `toycli twitter likes` | |
| `toycli twitter lists` | |
| `toycli twitter list-tweets` | |
| `toycli twitter list-create` | Create a Twitter/X list via GraphQL and return the created list id |
| `toycli twitter list-delete` | Delete a Twitter/X list you own after explicit confirmation |
| `toycli twitter list-add` | |
| `toycli twitter list-add-batch` | Add multiple users to a Twitter/X list you own from a comma-separated username list |
| `toycli twitter list-remove` | |
| `toycli twitter list-remove-batch` | Remove multiple users from a Twitter/X list you own from a comma-separated username list |
| `toycli twitter article` | |
| `toycli twitter follow` | |
| `toycli twitter unfollow` | |
| `toycli twitter bookmark` | |
| `toycli twitter unbookmark` | |
| `toycli twitter block` | |
| `toycli twitter unblock` | |
| `toycli twitter hide-reply` | |
| `toycli twitter download` | Download media from a profile via GraphQL UserMedia pagination, or from one tweet URL |
| `toycli twitter accept` | |
| `toycli twitter reply-dm` | |
| `toycli twitter unlike` | |
| `toycli twitter retweet` | |
| `toycli twitter unretweet` | |
| `toycli twitter quote` | |

## Usage Examples

```bash
# Quick start
toycli twitter trending --limit 5

# Search top tweets (default)
toycli twitter search "react 19"

# Search latest/live tweets
toycli twitter search "react 19" --filter live

# Get following/followers list (supports large limits)
toycli twitter following @elonmusk --limit 200
toycli twitter followers @elonmusk --limit 100

# Download profile media with cursor pagination
toycli twitter download @elonmusk --limit 50 --output ./twitter-media

# Download media from a single tweet
toycli twitter download --tweet-url https://x.com/jack/status/20 --output ./twitter-media

# Create a list and then manage members (requires login)
toycli twitter list-create "AI research" --description "Papers and labs" --mode private
toycli twitter list-delete 123456789 --confirm true
toycli twitter list-add 123456789 alice
toycli twitter list-add-batch 123456789 "@alice,@bob" --interval 5
toycli twitter list-remove 123456789 alice
toycli twitter list-remove-batch 123456789 "@alice,@bob" --interval 5

# Write actions (require login). Idempotent — calling twice is safe.
toycli twitter like https://x.com/jack/status/20
toycli twitter unlike https://x.com/jack/status/20
toycli twitter retweet https://x.com/jack/status/20
toycli twitter unretweet https://x.com/jack/status/20
toycli twitter quote https://x.com/jack/status/20 "great take"

# JSON output
toycli twitter trending -f json

# Verbose mode
toycli twitter trending -v
```

## Prerequisites

- Chrome running and **logged into** twitter.com
- [Browser Bridge extension](/guide/browser-bridge) installed

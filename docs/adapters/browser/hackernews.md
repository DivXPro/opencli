# HackerNews

**Mode**: 🌐 Public · **Domain**: `news.ycombinator.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli hackernews top` | Hacker News top stories |
| `toycli hackernews new` | Hacker News newest stories |
| `toycli hackernews best` | Hacker News best stories |
| `toycli hackernews ask` | Hacker News Ask HN posts |
| `toycli hackernews show` | Hacker News Show HN posts |
| `toycli hackernews jobs` | Hacker News job postings |
| `toycli hackernews search <query>` | Search Hacker News stories |
| `toycli hackernews user <username>` | Hacker News user profile |
| `toycli hackernews read <id>` | Read a story and its comment tree |

## Usage Examples

```bash
# Top stories
toycli hackernews top --limit 5

# Newest stories
toycli hackernews new --limit 10

# Search stories
toycli hackernews search "machine learning" --limit 5

# User profile
toycli hackernews user pg

# JSON output
toycli hackernews top -f json

# Sort search by date
toycli hackernews search "rust" --sort date

# Read a story and its top comments (id from any listing's `id` column)
toycli hackernews read 47999636 --limit 5 --depth 2
```

## Prerequisites

- No browser required — uses public API

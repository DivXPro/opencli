# LessWrong

**Mode**: Public · **Domain**: `www.lesswrong.com`

Rationality community and AI alignment research forum.

## Commands

| Command | Description |
|---------|-------------|
| `toycli lesswrong curated` | Editor's picks |
| `toycli lesswrong frontpage` | Algorithmic frontpage feed |
| `toycli lesswrong new` | Latest posts |
| `toycli lesswrong top` | Top rated (all time) |
| `toycli lesswrong top-week` | Top rated this week |
| `toycli lesswrong top-month` | Top rated this month |
| `toycli lesswrong top-year` | Top rated this year |
| `toycli lesswrong read` | Read full post by URL or ID |
| `toycli lesswrong comments` | Top comments on a post |
| `toycli lesswrong user` | User profile |
| `toycli lesswrong user-posts` | List a user's posts |
| `toycli lesswrong tag` | Posts by tag |
| `toycli lesswrong tags` | List popular tags |
| `toycli lesswrong sequences` | Post collections |
| `toycli lesswrong shortform` | Quick takes |

## Usage Examples

```bash
# Browse curated posts
toycli lesswrong curated --limit 5

# Top posts this week
toycli lesswrong top-week --limit 10

# Read a specific post
toycli lesswrong read CzoiqGzpShprcv2Jd
toycli lesswrong read https://www.lesswrong.com/posts/xxx/slug

# Posts tagged "AI"
toycli lesswrong tag ai --limit 5

# User profile and posts
toycli lesswrong user zvi
toycli lesswrong user-posts zvi --limit 5

# Comments on a post
toycli lesswrong comments CzoiqGzpShprcv2Jd --limit 10

# JSON output
toycli lesswrong curated -f json
```

## Prerequisites

- No browser required — uses public LessWrong GraphQL API

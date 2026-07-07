# 牛客网 (Nowcoder)

**Mode**: 🌐 / 🔐 · **Domain**: `nowcoder.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli nowcoder hot` | Hot search ranking |
| `toycli nowcoder trending` | Trending posts |
| `toycli nowcoder topics` | Hot discussion topics |
| `toycli nowcoder recommend` | Recommended feed |
| `toycli nowcoder creators` | Top content creators leaderboard |
| `toycli nowcoder companies` | Hot companies for interview prep |
| `toycli nowcoder jobs` | Career category listing |
| `toycli nowcoder search <query>` | Full-text search (type: all/post/question/user/job) |
| `toycli nowcoder suggest <query>` | Search suggestions |
| `toycli nowcoder experience` | Interview experience posts |
| `toycli nowcoder referral` | Internal referral posts |
| `toycli nowcoder salary` | Salary disclosure posts |
| `toycli nowcoder papers` | Interview question bank by company & job |
| `toycli nowcoder practice` | Categorized practice questions with progress |
| `toycli nowcoder notifications` | Unread message summary |
| `toycli nowcoder detail <id>` | Post detail view (supports ID / UUID / URL) |

## Usage Examples

```bash
# Hot search ranking
toycli nowcoder hot --limit 10

# Search for interview experiences
toycli nowcoder search "bilibili" --type post --limit 5

# Search suggestions
toycli nowcoder suggest "java"

# Browse interview experience posts
toycli nowcoder experience --limit 10

# View a specific post detail (using UUID from list commands)
toycli nowcoder detail 2b6b64d4adb34ea3838e832ae4447ab1

# Interview question bank for Java at Huawei
toycli nowcoder papers --job 11002 --company 239

# Practice questions for software development
toycli nowcoder practice --job 11226 --limit 10

# Hot companies for C++ positions
toycli nowcoder companies --job 11003

# JSON output
toycli nowcoder trending -f json

# Verbose mode
toycli nowcoder hot -v
```

## Prerequisites

- **Public commands** (hot, trending, topics, recommend, creators, companies, jobs): No login required
- **Cookie commands** (all others): Chrome running and **logged into** nowcoder.com, [Browser Bridge extension](/guide/browser-bridge) installed

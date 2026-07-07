# LINUX DO

**Mode**: 🔐 Browser · **Domain**: `linux.do`

## Commands

| Command | Description |
|---------|-------------|
| `toycli linux-do feed` | Browse topics (site-wide, by tag, or by category) |
| `toycli linux-do categories` | List all categories |
| `toycli linux-do tags` | List popular tags |
| `toycli linux-do search <query>` | Search topics |
| `toycli linux-do topic <id>` | View topic posts |
| `toycli linux-do topic-content <id>` | Read the main topic body as Markdown |
| `toycli linux-do user-topics <username>` | Topics created by a user |
| `toycli linux-do user-posts <username>` | Replies posted by a user |

## feed

Browse topic listings. Defaults to latest topics when called with no arguments.

- Supports filtering by `--tag`, `--category`, or both
- `--tag` accepts tag name, slug, or ID
- `--category` accepts category name, slug, ID, or `Parent / Child` path for sub-categories
- Use `--view` to switch between latest / hot / top

### Basic

```bash
# Latest topics (default)
toycli linux-do feed

# Hot topics
toycli linux-do feed --view hot

# Top topics — default period is weekly
toycli linux-do feed --view top
toycli linux-do feed --view top --period daily
toycli linux-do feed --view top --period monthly

# Sort by views descending
toycli linux-do feed --order views

# Sort by created time ascending
toycli linux-do feed --order created --ascending

# Limit results
toycli linux-do feed --limit 10

# JSON output
toycli linux-do feed -f json
```

### Filter by tag

```bash
# By tag name, slug, or ID — all equivalent
toycli linux-do feed --tag "ChatGPT"
toycli linux-do feed --tag chatgpt
toycli linux-do feed --tag 3

# Tag + hot view
toycli linux-do feed --tag "ChatGPT" --view hot

# Tag + top view with period
toycli linux-do feed --tag "OpenAI" --view top --period monthly
```

### Filter by category

Supports both top-level and sub-categories. Sub-categories auto-resolve their parent path.

```bash
# Top-level category — name, slug, or ID
toycli linux-do feed --category "开发调优"
toycli linux-do feed --category develop
toycli linux-do feed --category 4

# Sub-category
toycli linux-do feed --category "开发调优 / Lv1"
toycli linux-do feed --category "网盘资源"

# Category + hot / top view
toycli linux-do feed --category "开发调优" --view hot
toycli linux-do feed --category "开发调优" --view top --period weekly
```

### Category + tag

Combine `--category` and `--tag` to narrow results within a category.

```bash
toycli linux-do feed --category "开发调优" --tag "ChatGPT"
toycli linux-do feed --category "网盘资源" --tag "OpenAI"
toycli linux-do feed --category 94 --tag 4 --view top --period monthly
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--view V` | `latest`, `hot`, `top` | `latest` |
| `--tag VALUE` | Tag name, slug, or ID | — |
| `--category VALUE` | Category name, slug, or ID | — |
| `--limit N` | Number of results | `20` |
| `--order O` | `default`, `created`, `activity`, `views`, `posts`, `category`, `likes`, `op_likes`, `posters` | `default` |
| `--ascending` | Sort ascending instead of descending | off |
| `--period P` | `all`, `daily`, `weekly`, `monthly`, `quarterly`, `yearly` (only with `--view top`) | `weekly` |

Output columns: `title`, `replies`, `created`, `likes`, `views`, `url`

## categories

List forum categories with optional sub-category expansion.

```bash
toycli linux-do categories
toycli linux-do categories --subcategories
toycli linux-do categories --limit 50
```

When `--subcategories` is enabled, sub-categories are rendered as `Parent / Child` so the `name` value can be copied directly into `toycli linux-do feed --category ...`.

Output columns: `name`, `slug`, `id`, `topics`, `description`

## tags

List tags sorted by usage count.

```bash
toycli linux-do tags
toycli linux-do tags --limit 50
```

Output columns: `rank`, `name`, `count`, `url`

## search

Search topics by keyword.

```bash
toycli linux-do search "NixOS"
toycli linux-do search "Docker" --limit 10
toycli linux-do search "Claude" -f json
```

Output columns: `rank`, `title`, `views`, `likes`, `replies`, `url`

## topic

View summarized first-page posts within a topic.

```bash
toycli linux-do topic 1234
toycli linux-do topic 1234 --limit 50
```

Notes:
- `content` is a plain-text summary extracted from each first-page post
- Each summary is truncated to 200 characters
- Use `toycli linux-do topic-content <id>` for the full main post body in Markdown

Output columns: `author`, `content`, `likes`, `created_at`

## topic-content

Read the main topic body as Markdown.

```bash
toycli linux-do topic-content 1234
toycli linux-do topic-content 1234 -f json
```

Notes:
- Default output prints the Markdown body directly for copy/paste or piping into LLMs
- Use `-f json` if you want a machine-readable wrapper

Output columns: `content`

## user-topics

List topics created by a user.

```bash
toycli linux-do user-topics neo
toycli linux-do user-topics neo --limit 10
```

Output columns: `rank`, `title`, `replies`, `created_at`, `likes`, `views`, `url`

## user-posts

List replies posted by a user.

```bash
toycli linux-do user-posts neo
toycli linux-do user-posts neo --limit 10
```

Output columns: `index`, `topic_user`, `topic`, `reply`, `time`, `url`

## Prerequisites

- Chrome running and **logged into** linux.do
- [Browser Bridge extension](/guide/browser-bridge) installed

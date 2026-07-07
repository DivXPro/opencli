# Zhihu

**Mode**: 🔐 Browser · **Domain**: `zhihu.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli zhihu hot` | Read Zhihu hot topics |
| `toycli zhihu recommend` | Read Zhihu home recommendations |
| `toycli zhihu search` | Search Zhihu content |
| `toycli zhihu question` | Read question answers by question ID |
| `toycli zhihu answer-detail <id>` | Read one full answer by answer ID, typed target, or answer URL |
| `toycli zhihu answer-comments <id>` | Read flattened comments for one answer |
| `toycli zhihu collections` | List your Zhihu favorite collections |
| `toycli zhihu collection <collection_id>` | List content from a Zhihu favorite collection |
| `toycli zhihu download` | Export a Zhihu article to Markdown |
| `toycli zhihu follow <target> --execute` | Follow a user or question |
| `toycli zhihu like <target> --execute` | Like an answer or article |
| `toycli zhihu favorite <target> (--collection <name> \| --collection-id <id>) --execute` | Favorite an answer or article into a specific collection |
| `toycli zhihu comment <target> (<text> \| --file <path>) --execute` | Create a top-level comment when a fresh top-level editor is already present |
| `toycli zhihu answer <target> (<text> \| --file <path>) --execute` | Create a new answer when a fresh answer editor is already present |

## Target Formats

- Question: `question:123456` or `https://www.zhihu.com/question/123456`
- Answer: `answer:123456:789012` or `https://www.zhihu.com/question/123456/answer/789012`
- Article: `article:998877` or `https://zhuanlan.zhihu.com/p/998877`
- User: `user:alice` or `https://www.zhihu.com/people/alice`

## Write Safety Notes

- All write commands require `--execute`
- `favorite` requires exactly one of `--collection` or `--collection-id`
- `favorite` only supports existing collections, it does not create new collections
- `comment` only supports top-level comments
- `comment` currently requires the page to already expose a fresh top-level comment editor
- `answer` only supports creating a new non-anonymous plain-text answer
- `answer` currently requires the page to already expose a fresh answer editor
- `comment` and `answer` also support `--file <path>` for multi-line payloads
- Article targets can live on `zhuanlan.zhihu.com`, while question and answer targets stay on `www.zhihu.com`

## Usage Examples

```bash
# Read flows
toycli zhihu hot --limit 5
toycli zhihu recommend --limit 20
toycli zhihu search codex --type answer --limit 20
toycli zhihu search "Claude Code vs Codex?" --type all --limit 20
toycli zhihu question 123456 --limit 3
toycli zhihu answer-detail answer:123456:789012
toycli zhihu answer-detail "https://www.zhihu.com/question/123456/answer/789012" --max-content 2000
toycli zhihu answer-comments answer:123456:789012 --limit 20 --replies-limit 3
toycli zhihu collections --limit 20
toycli zhihu collection 83283292 --limit 20
toycli zhihu download "https://zhuanlan.zhihu.com/p/998877" --download-images

# Write flows
toycli zhihu follow question:123456 --execute
toycli zhihu follow user:alice --execute
toycli zhihu like answer:123456:789012 --execute
toycli zhihu like article:998877 --execute
toycli zhihu favorite article:998877 --collection "默认收藏夹" --execute
toycli zhihu favorite answer:123456:789012 --collection-id fav-b --execute
toycli zhihu comment answer:123456:789012 --file ./comment.txt --execute
toycli zhihu answer question:123456 --file ./answer.txt --execute

# JSON output
toycli zhihu hot -f json
```

## Search Notes

- Quote queries that contain spaces or shell-special characters, for example `toycli zhihu search "Claude Code vs Codex?"`
- `search --type` supports `all`, `answer`, `article`, and `question`
- `search --limit` supports up to 1000 results, but normal-sized requests are recommended

## Comment Notes

- `answer-comments --limit` counts top-level comments
- `answer-comments --replies-limit` expands up to that many replies per top-level comment
- Comment rows are flattened in Zhihu order. Zhihu's comments API does not expose stable parent comment ids here, so `parent_id` stays empty and `depth` does not claim nested-thread evidence; use `reply_to`, `comment_rank`, and `reply_rank` only as display hints within the flat stream.

## Prerequisites

- Chrome running and **logged into** zhihu.com
- [Browser Bridge extension](/guide/browser-bridge) installed
- A logged-in Zhihu session that can access both `www.zhihu.com` and `zhuanlan.zhihu.com`

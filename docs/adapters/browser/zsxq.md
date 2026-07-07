# 知识星球 (ZSXQ)

**Mode**: 🔐 Browser · **Domain**: `wx.zsxq.com`

Read groups, topics, search results, dynamics, and single-topic details from [知识星球](https://wx.zsxq.com) using your logged-in Chrome session.

## Commands

| Command | Description |
|---------|-------------|
| `toycli zsxq groups` | List the groups your account has joined |
| `toycli zsxq topics` | List topics in the active group |
| `toycli zsxq topic <id>` | Fetch a single topic with comments |
| `toycli zsxq search <keyword>` | Search topics inside a group |
| `toycli zsxq dynamics` | List recent dynamics across groups |

## Usage Examples

```bash
# List your groups
toycli zsxq groups

# List topics from the active group in Chrome
toycli zsxq topics --limit 20

# Search inside the active group
toycli zsxq search "toycli"

# Search inside a specific group explicitly
toycli zsxq search "toycli" --group_id 123456789

# Export a single topic with comments
toycli zsxq topic 987654321 --comment_limit 20

# Read recent dynamics across all joined groups
toycli zsxq dynamics --limit 20
```

## Prerequisites

- Chrome running and **logged into** [wx.zsxq.com](https://wx.zsxq.com)
- [Browser Bridge extension](/guide/browser-bridge) installed

## Notes

- `zsxq topics` and `zsxq search` use the current active group context from Chrome by default
- If there is no active group context, pass `--group_id <id>` or open the target group in Chrome first
- `zsxq groups` returns `group_id`, which you can reuse with `--group_id`
- `zsxq topic` surfaces a missing topic as `NOT_FOUND` instead of a generic fetch error

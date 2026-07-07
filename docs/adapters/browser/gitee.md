# Gitee

**Mode**: 🌐 Public (Browser) · **Domain**: `gitee.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli gitee trending` | Recommended open-source projects from Gitee Explore |
| `toycli gitee search` | Search Gitee repositories by keyword |
| `toycli gitee user` | Show user profile panel (nickname, followers, public repos, Gitee index) |

## Usage Examples

```bash
# Explore recommended projects
toycli gitee trending --limit 10

# Search repositories
toycli gitee search toycli --limit 10

# User profile panel
toycli gitee user fu-qingrong

# JSON output
toycli gitee trending --limit 5 -f json
toycli gitee search "ai agent" --limit 5 -f json
toycli gitee user jackwener -f json
```

## Prerequisites

- Chrome running with [Browser Bridge extension](/guide/browser-bridge) installed
- No login required for these public commands

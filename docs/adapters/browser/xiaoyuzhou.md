# Xiaoyuzhou (小宇宙)

**Mode**: 🔑 Local API · **Domain**: `xiaoyuzhou.fm`

## Commands

| Command | Description |
|---------|-------------|
| `toycli xiaoyuzhou podcast` | View a podcast profile (requires local credentials) |
| `toycli xiaoyuzhou podcast-episodes` | List podcast episodes (requires local credentials) |
| `toycli xiaoyuzhou episode` | View episode details (requires local credentials) |
| `toycli xiaoyuzhou download` | Download episode audio (requires local credentials) |
| `toycli xiaoyuzhou transcript` | Download transcript JSON and extracted text (requires local credentials) |

## Usage Examples

```bash
# Podcast profile
toycli xiaoyuzhou podcast 6013f9f58e2f7ee375cf4216

# Recent episodes
toycli xiaoyuzhou podcast-episodes 6013f9f58e2f7ee375cf4216 --limit 5

# Episode details
toycli xiaoyuzhou episode 69b3b675772ac2295bfc01d0

# Download episode audio
toycli xiaoyuzhou download 69b3b675772ac2295bfc01d0 --output ./xiaoyuzhou

# Download transcript JSON + text
toycli xiaoyuzhou transcript 69dd0c98e2c8be31551f6a33 --output ./xiaoyuzhou-transcripts

# JSON output
toycli xiaoyuzhou episode 69b3b675772ac2295bfc01d0 -f json

# Verbose mode
toycli xiaoyuzhou transcript 69dd0c98e2c8be31551f6a33 -v
```

## Prerequisites

- No browser required — uses the authenticated Xiaoyuzhou API
- All commands require local Xiaoyuzhou app credentials in `~/.toycli/xiaoyuzhou.json`

Example credential file:

```json
{
  "access_token": "your-access-token",
  "refresh_token": "your-refresh-token",
  "device_id": "81ADBFD6-6921-482B-9AB9-A29E7CC7BB55",
  "device_properties": "",
  "expires_at": 0
}
```

# DeepSeek

**Mode**: Browser · **Domain**: `chat.deepseek.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli deepseek ask <prompt>` | Send a prompt and get the response |
| `toycli deepseek new` | Start a new conversation |
| `toycli deepseek status` | Check login state and page availability |
| `toycli deepseek read` | Read the current conversation |
| `toycli deepseek history` | List conversation history from sidebar |
| `toycli deepseek detail <id>` | Read a specific conversation by ID or URL |
| `toycli deepseek send <id> <prompt>` | Send a prompt to a specific conversation without waiting for a response |

## Usage Examples

```bash
# Ask a question
toycli deepseek ask "explain quicksort in 3 sentences"

# Start a new chat before asking
toycli deepseek ask "hello" --new

# Use Expert model instead of Instant
toycli deepseek ask "prove that sqrt(2) is irrational" --model expert

# Use Vision model with an image
toycli deepseek ask "describe this image" --model vision --file ./image.png

# Enable DeepThink mode
toycli deepseek ask "prove that sqrt(2) is irrational" --think

# Enable web search
toycli deepseek ask "latest news about AI" --search

# Attach a file
toycli deepseek ask "summarize this document" --file ./report.pdf

# Combine modes
toycli deepseek ask "what happened today?" --model expert --think --search --new

# Custom timeout (default: 120s)
toycli deepseek ask "write a long essay" --timeout 180

# JSON output
toycli deepseek ask "hello" -f json

# Check login status
toycli deepseek status

# Start a fresh conversation
toycli deepseek new

# Read current conversation
toycli deepseek read

# List recent conversations
toycli deepseek history --limit 10

# Read a specific conversation by UUID or /a/chat/s/<id> URL
toycli deepseek detail 749e6bbd-6a45-4440-beaa-ae5238bf06d8

# Send to a specific existing conversation
toycli deepseek send 749e6bbd-6a45-4440-beaa-ae5238bf06d8 "continue from the last answer"
```

### Options (ask)

| Option | Description |
|--------|-------------|
| `<prompt>` | The message to send (required, positional) |
| `--timeout` | Wait timeout in seconds (default: 120) |
| `--new` | Start a new chat before sending (default: false) |
| `--model` | Model to use: `instant`, `expert`, or `vision` (default: instant) |
| `--think` | Enable DeepThink mode (default: false) |
| `--search` | Enable web search (default: false) |
| `--file` | Attach a file (PDF, image, text) with the prompt (max 100 MB) |

### Options (detail)

| Option | Description |
|--------|-------------|
| `<id>` | DeepSeek conversation UUID or full `/a/chat/s/<id>` URL |

### Options (send)

| Option | Description |
|--------|-------------|
| `<id>` | DeepSeek conversation UUID or full `/a/chat/s/<id>` URL |
| `<prompt>` | The message to send (required, positional) |

## Prerequisites

- Chrome running with [Browser Bridge extension](/guide/browser-bridge) installed
- Logged in to [chat.deepseek.com](https://chat.deepseek.com)

## Caveats

- This adapter drives the DeepSeek web UI in the browser, not an API
- DeepSeek commands default to persistent site sessions, so consecutive `deepseek ask` / `deepseek read` / `deepseek detail` invocations continue in the same DeepSeek page. Pass `--site-session ephemeral` for a one-shot tab.
- Default mode is Instant with DeepThink and Search disabled; each flag (`--model`, `--think`, `--search`) is synced on every invocation so omitting a flag resets it
- Vision mode does not support `--search`; use `--model instant` or `--model expert` for web search
- `send` requires an explicit conversation ID; use `history` to find a conversation URL or ID first
- Long responses (code, essays) may need a higher `--timeout`
- File upload prefers the browser file-input path, falls back to base64 injection when needed, and rejects files over 100 MB

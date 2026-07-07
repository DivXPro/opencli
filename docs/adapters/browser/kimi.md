# Kimi

Drive **Kimi** (`kimi.com`) from the terminal through your existing browser session.

**Mode**: 🔐 Browser · **Domain**: `kimi.com`

## Commands

| Command | Description | Access |
|---------|-------------|--------|
| `toycli kimi status` | Check page connection, login state, and current URL | read |
| `toycli kimi account` | Read sidebar account labels | read |
| `toycli kimi usage` | Read Kimi Code console usage, rate limit, membership, and model permission cards | read |
| `toycli kimi history` | List visible sidebar conversations | read |
| `toycli kimi detail <id>` | Open a chat by ID or trusted `/chat/<id>` URL and read messages | read |
| `toycli kimi read` | Read messages in the current or selected chat | read |
| `toycli kimi send <prompt>` | Send a prompt without waiting for the assistant reply | write |
| `toycli kimi ask <prompt>` | Send a prompt and wait for the assistant reply | write |
| `toycli kimi new` | Start a new chat | write |
| `toycli kimi model` | Read, list, or switch the active model | write |
| `toycli kimi mode [name]` | List or navigate to a Kimi work mode | write |
| `toycli kimi copy-message` | Copy or return the last assistant message | write |
| `toycli kimi react` | Like or dislike the last assistant message | write |
| `toycli kimi regenerate` | Regenerate the last assistant message | write |
| `toycli kimi share` | Open the share dialog for the last assistant message | write |
| `toycli kimi history-rename --yes` | Rename a chat from the history page | write |
| `toycli kimi sidebar-toggle` | Toggle the sidebar | write |
| `toycli kimi view-all-history` | Navigate to the full history page | write |
| `toycli kimi settings` | Open settings | write |
| `toycli kimi sign-out --yes` | Sign out from settings | write |
| `toycli kimi upgrade` | Open the membership/upgrade entry point | write |
| `toycli kimi dismiss-banner` | Close a visible sidebar banner | write |
| `toycli kimi templates` | List template cards on a mode page | read |
| `toycli kimi storage-keys` | List localStorage or sessionStorage keys | read |
| `toycli kimi storage-get <key>` | Read one storage value | read |
| `toycli kimi cookies` | List JavaScript-visible cookies | read |
| `toycli kimi idb-list` | List IndexedDB databases | read |

## Usage Examples

```bash
# Check the current Kimi tab
toycli kimi status

# Read Kimi Code usage cards
toycli kimi usage

# Start a new chat and ask a question
toycli kimi new
toycli kimi ask "Summarize this plan in three bullets"

# Continue the current chat without waiting for a reply
toycli kimi send "Now expand the second bullet"

# List and read conversations
toycli kimi history --limit 10
toycli kimi detail https://kimi.com/chat/<chat-id>
toycli kimi read --conv /chat/<chat-id>

# Inspect or switch model
toycli kimi model
toycli kimi model --list true
toycli kimi model --set "K2"

# Rename a chat only after explicit confirmation
toycli kimi history-rename <chat-id> "New title" --yes true
```

## Options

| Option | Description |
|--------|-------------|
| `prompt` | Prompt to send for `ask` / `send` |
| `--conv` | Chat id, exact `/chat/<id>` path, or trusted `https://kimi.com/chat/<id>` URL for commands that target a chat |
| `--timeout` | Max seconds for `ask` to wait for a reply |
| `--limit` | Max rows for history, read, detail, or storage listings |
| `--set` | Model name to switch to; exact match is preferred, otherwise only a unique partial match is allowed |
| `--list` | Open the model menu and list model options |
| `--yes` | Required for destructive or account-changing commands such as `history-rename` and `sign-out` |

## Behavior

- Kimi commands use a persistent browser site session and operate on the live `kimi.com` UI.
- `usage` navigates to the Kimi Code console and reads the visible dashboard cards without writing account state.
- Chat ids accept bare ids, exact relative `/chat/<id>` paths, or `https://kimi.com/chat/<id>` / `https://www.kimi.com/chat/<id>` URLs only.
- `send` / `ask` verify that a new user turn containing the prompt appears after clicking Send.
- `ask` waits for an assistant turn to appear and stabilize; timeout is reported as a typed timeout instead of a successful row.
- Model switching rejects ambiguous partial matches before clicking and verifies the selected model by reading the UI back.
- `copy-message --click-button` writes to the local clipboard, so the command is marked as write access.

## Prerequisites

- Chrome is running
- You are already signed into `kimi.com`
- [Browser Bridge extension](/guide/browser-bridge) is installed

## Caveats

- This adapter targets the Kimi web UI and can break when Kimi changes DOM structure, labels, or SVG names.
- Sidebar/history commands only see conversations that the current UI has rendered.
- Cookie output is limited to cookies visible to JavaScript; httpOnly cookies are intentionally not exposed.

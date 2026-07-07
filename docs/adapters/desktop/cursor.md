# Cursor

Control the **Cursor IDE** from the terminal via Chrome DevTools Protocol (CDP). Since Cursor is built on Electron (VS Code fork), ToyCLI can drive its internal UI, automate Composer interactions, and manipulate chat sessions.

## Prerequisites

1. Install [Cursor](https://cursor.sh/).
2. Launch it with the remote debugging port:
   ```bash
   /Applications/Cursor.app/Contents/MacOS/Cursor --remote-debugging-port=9226
   ```

## Setup

```bash
export TOYCLI_CDP_ENDPOINT="http://127.0.0.1:9226"
```

## Commands

### Diagnostics
- `toycli cursor status`: Check CDP connection status.
- `toycli cursor dump`: Dump the full DOM and Accessibility snapshot to `/tmp/cursor-dom.html` and `/tmp/cursor-snapshot.json`.
- `toycli cursor screenshot`: Capture DOM + snapshot artifacts of the current window.

### Chat Manipulation
- `toycli cursor new`: Press `Cmd+N` to start a new file/tab.
- `toycli cursor send "message"`: Inject text into the active Composer/Chat input and submit.
- `toycli cursor ask "message"`: Send + wait + read in one shot.
- `toycli cursor read`: Extract the full conversation history from the active chat panel.

### AI Features
- `toycli cursor composer "prompt"`: Open the Composer panel (`Cmd+I`) and send a prompt for inline AI editing.
- `toycli cursor model`: Get the currently active AI model (e.g., `claude-4.5-sonnet`).
- `toycli cursor extract-code`: Extract all code blocks from the current conversation.
- `toycli cursor history`: List recent chat/composer sessions from the sidebar.
- `toycli cursor export`: Export the current conversation as Markdown.

# Codex

Control the **OpenAI Codex Desktop App** headless or headfully via Chrome DevTools Protocol (CDP). Because Codex is built on Electron, ToyCLI can directly drive its internal UI, automate slash commands, and manipulate its AI agent threads.

## Prerequisites

1. You must have the official OpenAI Codex app installed.
2. Launch it via the terminal and expose the remote debugging port:
   ```bash
   # macOS
   /Applications/Codex.app/Contents/MacOS/Codex --remote-debugging-port=9238
   ```

## Setup

```bash
export TOYCLI_CDP_ENDPOINT="http://127.0.0.1:9238"
```

## Commands

### Diagnostics
- `toycli codex status`: Checks connection and reads the current active window URL/title.
- `toycli codex dump`: Dumps the full UI DOM and Accessibility tree into `/tmp`.
- `toycli codex screenshot`: Captures DOM + snapshot artifacts of the current window.

### Agent Manipulation
- `toycli codex new`: Simulates `Cmd+N` to start a completely fresh and isolated Git Worktree thread context.
- `toycli codex send "message"`: Robustly finds the active Thread Composer and injects your text.
  - *Pro-tip*: You can trigger internal shortcuts, e.g., `toycli codex send "/review"`.
- `toycli codex ask "message"`: Send + wait + read in one shot.
- `toycli codex read`: Extracts the entire current thread history and AI reasoning logs.
- `toycli codex projects`: List visible sidebar projects and conversations.
- `toycli codex history`: List visible conversation threads grouped by project.
- `toycli codex extract-diff`: Automatically scrapes any visual Patch chunks and Code Diffs.
- `toycli codex model`: Get, list, or switch the currently active model / reasoning level.
- `toycli codex export`: Export the current conversation as Markdown.

### Conversation Management
- `toycli codex pin`: Pin the selected conversation and verify the sidebar row becomes pinned.
- `toycli codex unpin`: Unpin the selected conversation and verify the sidebar row becomes unpinned.
- `toycli codex archive --yes`: Archive the selected conversation after verifying the row disappears. Without `--yes`, it only returns a dry-run preview.
- `toycli codex rename "New title"`: Rename the selected conversation and verify the same thread row shows the new title.

### Selecting a Project Conversation

`send`, `ask`, `read`, `pin`, `unpin`, `archive`, and `rename` can select a visible sidebar conversation before acting:

```bash
toycli codex projects
toycli codex send "Sync the repo and report blockers" --project stock --conversation "同步各仓库最新代码"
toycli codex ask "Summarize current status" --project toycli --index 2 --timeout 120
toycli codex read --project /Users/youngcan/stock --thread-id local:019df125-bf8b-77f0-ade5-de44670db82d
toycli codex pin --project toycli --index 2
toycli codex rename "Release triage" --thread-id local:019df125-bf8b-77f0-ade5-de44670db82d
```

Project selection matches either the project label or path. Conversation selection accepts `--conversation`, `--index`, or `--thread-id`.

# NotebookLM

**Mode**: 🔐 Browser Bridge · **Domain**: `notebooklm.google.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli notebooklm status` | Check whether NotebookLM is reachable in the current Chrome session |
| `toycli notebooklm list` | List notebooks visible from the NotebookLM home page |
| `toycli notebooklm open <notebook>` | Open one notebook in the NotebookLM adapter session by id or URL |
| `toycli notebooklm current` | Show metadata for the currently opened notebook in the adapter session |
| `toycli notebooklm get` | Get richer metadata for the current notebook |
| `toycli notebooklm source-list` | List sources in the current notebook |
| `toycli notebooklm source-get <source>` | Resolve one source in the current notebook by id or title |
| `toycli notebooklm source-fulltext <source>` | Fetch extracted source fulltext through NotebookLM RPC |
| `toycli notebooklm source-guide <source>` | Fetch guide summary and keywords for one source |
| `toycli notebooklm history` | List conversation history threads for the current notebook |
| `toycli notebooklm note-list` | List Studio notes visible in the current notebook |
| `toycli notebooklm notes-get <note>` | Read the currently visible Studio note by title |
| `toycli notebooklm summary` | Read the current notebook summary |
| `toycli notebooklm create <title> --execute` | Create a new NotebookLM notebook |
| `toycli notebooklm add-source <notebook> (--url <url> \| --content <text> \| --file <path>) --execute` | Add one source to an existing notebook |
| `toycli notebooklm write-note <notebook> --title <title> --content <markdown> --execute` | Create a Studio note in a notebook |
| `toycli notebooklm generate-audio <notebook> --execute` | Trigger Audio Overview generation for a notebook |
| `toycli notebooklm generate-slides <notebook> --execute` | Trigger slide deck generation for a notebook |

## Compatibility Aliases

| Alias | Canonical command |
|-------|-------------------|
| `toycli notebooklm select <notebook>` | `toycli notebooklm open <notebook>` |
| `toycli notebooklm metadata` | `toycli notebooklm get` |
| `toycli notebooklm notes-list` | `toycli notebooklm note-list` |

## Positioning

This adapter reuses the existing ToyCLI Browser Bridge runtime:

- no custom NotebookLM extension
- no exported cookie replay
- requests and page state stay in the real Chrome session

Read commands expose NotebookLM metadata, sources, notes, summaries, and history from desktop Chrome with an already logged-in Google account. Write commands call NotebookLM's in-page RPC endpoints from that same logged-in browser session and require an explicit `--execute` flag before any remote mutation is attempted.

## Usage Examples

```bash
toycli notebooklm status
toycli notebooklm list -f json
toycli notebooklm open nb-demo -f json
toycli notebooklm current -f json
toycli notebooklm get -f json
toycli notebooklm source-list -f json
toycli notebooklm source-get "Quarterly report" -f json
toycli notebooklm source-guide "Quarterly report" -f json
toycli notebooklm source-fulltext "Quarterly report" -f json
toycli notebooklm history -f json
toycli notebooklm note-list -f json
toycli notebooklm notes-get "Draft note" -f json
toycli notebooklm summary -f json

# Write commands refuse to mutate unless --execute is present.
toycli notebooklm create "Research Brief" --emoji "📒" --execute
toycli notebooklm add-source 17e2b882-6a01-4c6c-9262-0738dfa2abee --url https://example.com/report --execute
toycli notebooklm add-source 17e2b882-6a01-4c6c-9262-0738dfa2abee --content "Source text" --title "Pasted source" --execute
toycli notebooklm add-source 17e2b882-6a01-4c6c-9262-0738dfa2abee --file ./paper.pdf --execute
toycli notebooklm write-note 17e2b882-6a01-4c6c-9262-0738dfa2abee --title "Open questions" --content "## Next steps" --execute
toycli notebooklm generate-audio 17e2b882-6a01-4c6c-9262-0738dfa2abee --execute
toycli notebooklm generate-slides 17e2b882-6a01-4c6c-9262-0738dfa2abee --length 3 --language en --execute
```

## Prerequisites

- Chrome running and logged into Google / NotebookLM
- [Browser Bridge extension](/guide/browser-bridge) installed
- NotebookLM accessible in the current browser session

## Notes

- Notebook-oriented commands run in ToyCLI's owned NotebookLM adapter session/window. Use `toycli notebooklm open <notebook>` first to choose the current notebook for follow-up commands.
- `list`, `get`, `source-list`, `history`, `source-fulltext`, and `source-guide` prefer NotebookLM RPC paths and fall back only when the richer path is unavailable.
- `notes-get` currently reads note content only from the visible Studio note editor; if the note is listed but not open, open it in NotebookLM first and then retry.
- All NotebookLM write commands require `--execute` and fail before opening a browser/RPC write path when it is absent.
- Write commands accept a bare notebook UUID or a canonical `https://notebooklm.google.com/notebook/<uuid>` URL. Off-domain, non-HTTPS, credentialed, or custom-port notebook URLs are rejected.
- `add-source` accepts exactly one source input: `--url`, `--content`, or `--file`.

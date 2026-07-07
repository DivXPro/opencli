# Qoder

Control the **Qoder IDE** desktop app from ToyCLI through Chrome DevTools Protocol (CDP). Qoder is an Electron / VS Code-derived AI IDE; these commands operate the currently connected Qoder renderer, so open Qoder with remote debugging enabled before use.

## Prerequisites

1. Install Qoder.
2. Launch Qoder with CDP enabled on its registered port:

```bash
/Applications/Qoder.app/Contents/MacOS/Electron \
  --remote-debugging-port=9237 \
  --remote-allow-origins='*'
```

## Setup

```bash
export TOYCLI_CDP_ENDPOINT="http://127.0.0.1:9237"
```

## Commands

### Diagnostics

- `toycli qoder status`: Check the active Qoder renderer URL and title.

### Quest Lifecycle

- `toycli qoder new`: Start a new Quest.
- `toycli qoder history --limit 20`: List visible Quests from the sidebar.
- `toycli qoder read --limit 30`: Read visible turns in the current Quest.
- `toycli qoder send "message"`: Send a message to the current Quest.
- `toycli qoder ask "prompt" --timeout 120`: Send a prompt and wait for a visible reply.

### Sidebar And Views

- `toycli qoder sidebar-toggle`: Collapse or expand the Quest sidebar.
- `toycli qoder open-panel`: Toggle the bottom panel.
- `toycli qoder search "query"`: Open the Qoder search palette and list results.
- `toycli qoder settings`: Open Settings.
- `toycli qoder knowledge`: Open Knowledge.
- `toycli qoder marketplace`: Open Marketplace.
- `toycli qoder credits`: Open Credits Usage and read the visible popover.
- `toycli qoder view-all`: Click View all in the Quest list.
- `toycli qoder add-workspace`: Open the Add Workspace folder picker.
- `toycli qoder account [--username name]`: Open the account menu and list items.
- `toycli qoder more-actions`: Open More Actions and list menu items.

### Composer

- `toycli qoder prompt-enhance`: Click Prompt Enhance for the current draft.
- `toycli qoder open-editor`: Open the current draft in Qoder's editor view.

## Notes

Most commands use Qoder's visible desktop UI as the source of truth. Commands that click a button will fail with a typed error if the target control is not visible in the current Qoder view. `send` and `ask` require post-submit evidence from the visible Quest before returning success.

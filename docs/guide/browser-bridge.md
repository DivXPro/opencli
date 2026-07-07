# Browser Bridge Setup

> **⚠️ Important**: Browser commands reuse your Chrome login session. You must be logged into the target website in Chrome before running commands.

ToyCLI connects to your browser through a lightweight **Browser Bridge** Chrome Extension + micro-daemon (zero config, auto-start).

## Extension Installation

### Method 1: Download Pre-built Release (Recommended)

1. Go to the GitHub [Releases page](https://github.com/toy-box/toycli/releases) and download the latest `toycli-extension-v{version}.zip`.
2. Unzip the file and open `chrome://extensions`, enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the unzipped folder.

### Method 2: Load Unpacked Source (For Developers)

1. Open `chrome://extensions` and enable **Developer mode**.
2. Click **Load unpacked** and select the `extension/` directory from the repository.

## Verification

That's it! The daemon auto-starts when you run any browser command. No tokens, no manual configuration.

```bash
toycli doctor            # Check extension + daemon connectivity
```

## Tab Targeting

Browser commands require an explicit `<session>` positional immediately after `browser`. Use the same session name for a multi-step flow, and use different names to isolate parallel work.

```bash
toycli browser baidu open https://www.baidu.com/
toycli browser baidu tab list
toycli browser baidu tab new https://www.baidu.com/
toycli browser baidu eval --tab <targetId> 'document.title'
toycli browser baidu tab select <targetId>
toycli browser baidu get title
toycli browser baidu tab close <targetId>
```

Key rules:

- `toycli browser <session> open <url>` and `toycli browser <session> tab new [url]` return a `targetId`.
- `toycli browser <session> tab list` prints the `targetId` values of tabs that already exist.
- `--tab <targetId>` routes a single browser command to that specific tab.
- `tab new` creates a new tab but does not change the default browser target.
- `tab select <targetId>` makes that tab the default target for later untargeted `toycli browser ...` commands.
- `tab close <targetId>` removes the tab; if it was the current default target, the stored default is cleared.

## Session Lifecycle

Use a stable session name when you want multiple `toycli browser` commands to keep operating on the same page:

```bash
toycli browser my-session open https://example.com
toycli browser my-session state
toycli browser my-session extract "main"
```

Owned browser sessions use an interactive tab lease with a 10-minute idle timeout. Release it explicitly when done:

```bash
toycli browser my-session close
```

Use `toycli browser <session> bind` when you want to attach ToyCLI to a Chrome tab you already opened manually. Bound sessions do not have the owned-session idle close timer; they stay attached until `unbind`, tab close, window close, or daemon restart. For owned sessions, use `--window foreground` to watch ToyCLI work in a visible automation window, or `--window background` to keep that automation window out of the way.

The `ToyCLI Browser` and `ToyCLI Adapter` tab groups are extension-managed automation containers; avoid putting your own long-lived tabs in them or renaming them.

## How It Works

```
┌─────────────┐     WebSocket      ┌──────────────┐     Chrome API     ┌─────────┐
│  toycli    │ ◄──────────────► │  micro-daemon │ ◄──────────────► │  Chrome  │
│  (Node.js)  │    localhost:19825  │  (auto-start) │    Extension       │ Browser  │
└─────────────┘                    └──────────────┘                    └─────────┘
```

The daemon manages the WebSocket connection between your CLI commands and the Chrome extension. The extension executes JavaScript in the context of web pages, with access to the logged-in session.

## Daemon Lifecycle

The daemon auto-starts on first browser command and stays alive persistently.

```bash
toycli daemon stop      # Graceful shutdown
```

The daemon is persistent — it stays alive until you explicitly stop it (`toycli daemon stop`) or uninstall the package.

## Running ToyCLI from a remote machine

If you need to run `toycli` on a remote server (CI runner, agent host) but keep the browser session on your local machine, see [Remote Orchestration](/guide/remote-orchestration). It walks through the SSH reverse-tunnel pattern so the daemon never leaves localhost.

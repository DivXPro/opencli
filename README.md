# ToyCLI

> **Convert any website into a CLI & run Browser Use on your logged-in Chrome.**
> Turn websites, browser sessions, Electron apps, and local tools into deterministic interfaces for humans and AI agents.
> Or run Browser Use against any page — navigate, fill forms, click, extract, automate.

[![中文文档](https://img.shields.io/badge/docs-%E4%B8%AD%E6%96%87-0F766E?style=flat-square)](./README.zh-CN.md)
[![npm](https://img.shields.io/npm/v/@toy-box/opencli?style=flat-square)](https://www.npmjs.com/package/@toy-box/opencli)
[![Node.js Version](https://img.shields.io/node/v/@toy-box/opencli?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/@toy-box/opencli?style=flat-square)](./LICENSE)

ToyCLI gives you one surface for three different kinds of automation:

- **Use built-in adapters** for sites like Bilibili, Zhihu, Xiaohongshu, Reddit, HackerNews, Twitter/X, and [many more](#built-in-commands).
- **Let AI Agents operate any website** — install the `toycli-browser` skill in your AI agent (Claude Code, Cursor, etc.), and it can navigate, click, type/fill, extract, and inspect any page through your logged-in browser via `toycli browser` primitives.
- **Write new adapters** end-to-end with `toycli browser` + the `toycli-adapter-author` skill, which guides from first recon through field decoding, code, and `toycli browser verify`.

It also works as a **CLI hub** for local tools such as `gh`, `docker`, `longbridge`, `tg`, `discord`, `wx`, `ntn` (Notion), and other binaries you register yourself, plus **desktop app adapters** for Electron apps like Cursor, Trae CN, Codex, Antigravity, ChatGPT, and Trae SOLO.

## Quick Start

### 1. Install ToyCLI

For desktop use, start with **ToyCLIApp**. It bundles the ToyCLI runtime,
keeps the managed `toycli` command installed, and gives you a system tray UI
for setup, diagnostics, updates, browser-login keepalive, and Web → Markdown.

**Option A — ToyCLIApp (recommended for macOS / Windows):**
Download the latest app from <https://toycli.info/download>, install it, then
open the app once and use the System page to install or repair the `toycli`
command.

**Option B — npm global install (CLI-only / CI / servers):**
ToyCLI requires **Node.js >= 20** when installed through npm.

```bash
node --version
npm install -g @toy-box/opencli
```

### 2. Install the Browser Bridge Extension

ToyCLI connects to Chrome/Chromium through a lightweight Browser Bridge extension plus a small local daemon. The daemon auto-starts when needed.

**Option A — Chrome Web Store (recommended):**
Install **ToyCLI** from the [Chrome Web Store](https://chromewebstore.google.com/detail/toycli/ildkmabpimmkaediidaifkhjpohdnifk).

**Option B — Manual install:**
1. Download the latest `toycli-extension-v{version}.zip` from the GitHub [Releases page](https://github.com/toy-box/toycli/releases).
2. Unzip it, open `chrome://extensions`, and enable **Developer mode**.
3. Click **Load unpacked** and select the unzipped folder.

### 3. Verify the setup

```bash
toycli doctor
```

### 4. Optional: name your Chrome profile

Each Chrome profile runs its own ToyCLI extension instance. If you use multiple Chrome profiles, list the connected profiles and assign local aliases:

```bash
toycli profile list
toycli profile rename <contextId> work
toycli profile use work
toycli --profile work browser main state
```

With only one connected profile, ToyCLI uses it automatically. With multiple connected profiles and no default, ToyCLI asks you to choose instead of guessing.

### 5. Run your first commands

```bash
toycli list
toycli hackernews top --limit 5
toycli bilibili hot --limit 5
```

## For Humans

Use ToyCLI directly when you want a reliable command instead of a live browser session:

- `toycli list` shows every registered command.
- `toycli <site> <command>` runs a built-in or generated adapter.
- `toycli external register mycli` exposes a local CLI through the same discovery surface.
- `toycli doctor` helps diagnose browser connectivity.

## Extending ToyCLI

If you want to add your own commands, start with the [Extending ToyCLI guide](./docs/guide/extending-opencli.md). README keeps this short; the guide covers the directory layout, source-control model, and install commands.

| Need | Recommended path |
|------|------------------|
| Keep personal website commands in your own Git repo | `toycli plugin create` + `toycli plugin install file://...` |
| Quickly draft a private local adapter | `toycli browser init <site>/<command>` in `~/.toycli/clis/` |
| Modify an official adapter locally | `toycli adapter eject <site>` + `toycli adapter reset <site>` |
| Publish or install third-party commands | `toycli plugin install github:user/repo` |
| Wrap an existing local binary | `toycli external register <name>` |

## For AI Agents

ToyCLI's browser commands are designed to be used by AI Agents — not run manually. Install skills into your AI agent (Claude Code, Cursor, etc.), and the agent operates websites on your behalf using your logged-in Chrome session.

### Install skills (also refreshes existing installs)

```bash
npx skills add scopai/toycli
```

Or install only what you need:

```bash
npx skills add scopai/toycli --skill toycli-adapter-author
npx skills add scopai/toycli --skill toycli-autofix
npx skills add scopai/toycli --skill toycli-browser
npx skills add scopai/toycli --skill toycli-browser-sitemap
npx skills add scopai/toycli --skill toycli-sitemap-author
npx skills add scopai/toycli --skill toycli-usage
```

### Which skill to use

| Skill | When to use | Example prompt to your AI agent |
|-------|------------|-------------------------------|
| **toycli-adapter-author** | Write a reusable adapter for a new site or add a command to an existing site | "Write an adapter for douyin trending" / "Make a command that grabs the top posts from this page" |
| **toycli-autofix** | Repair a broken adapter when a built-in command fails | "`toycli zhihu hot` is returning empty — fix it" |
| **toycli-browser** | Drive a real Chrome page ad-hoc — navigate, fill forms, click, extract | "Help me check my Xiaohongshu notifications" / "Help me fill out this form" / "Use browser commands to scrape this page" |
| **toycli-browser-sitemap** | Consume site sitemap context while driving a browser task | "Use the sitemap to navigate this website without blind clicking" |
| **toycli-sitemap-author** | Create or update site sitemap knowledge for browser agents | "Record the stable workflow you just discovered for this site" |
| **toycli-usage** | Quick reference for all ToyCLI commands and sites | "What commands does ToyCLI have for Twitter?" |

### How it works

Once `toycli-browser` is installed, your AI agent can:

1. **Navigate** to any URL using your logged-in browser
2. **Read** page content via structured DOM snapshots (not screenshots)
3. **Interact** — click buttons, fill forms, select options, press keys
4. **Extract** data from the page or intercept network API responses
5. **Wait** for elements, text, or page transitions

The agent handles all the `toycli browser` commands internally — you just describe what you want done in natural language.

**Skill references:**
- [`skills/toycli-browser/SKILL.md`](./skills/toycli-browser/SKILL.md) — drive Chrome ad-hoc (navigate, fill forms, click, extract)
- [`skills/toycli-browser-sitemap/SKILL.md`](./skills/toycli-browser-sitemap/SKILL.md) — use sitemap context while driving a browser task
- [`skills/toycli-sitemap-author/SKILL.md`](./skills/toycli-sitemap-author/SKILL.md) — create or update site sitemap knowledge
- [`skills/toycli-adapter-author/SKILL.md`](./skills/toycli-adapter-author/SKILL.md) — write a new adapter end-to-end
- [`skills/toycli-autofix/SKILL.md`](./skills/toycli-autofix/SKILL.md) — repair broken adapters
- [`skills/toycli-usage/SKILL.md`](./skills/toycli-usage/SKILL.md) — command and site reference

Available browser commands include `open`, `state`, `click`, `type`, `fill`, `select`, `keys`, `wait`, `get`, `find`, `extract`, `frames`, `screenshot`, `scroll`, `back`, `eval`, `network`, `tab list`, `tab new`, `tab select`, `tab close`, `init`, `verify`, and `close`.

`toycli browser` commands require a `<session>` positional immediately after `browser`. `toycli browser work open <url>` and `toycli browser work tab new [url]` both return a target ID. Use `toycli browser work tab list` to inspect target IDs, then pass `--tab <targetId>` to route a command to a specific tab. `tab new` creates a new tab without changing the default browser target; only `tab select <targetId>` promotes that tab to the default target for later untargeted commands in the same session.

## Writing a new adapter

When the site you need is not yet covered, use the `toycli-adapter-author` skill end-to-end:

1. **Recon** the site and pick a pattern (SPA / SSR / JSONP / Token / Streaming).
2. **Discover** the right endpoint — network inspection, initial state, bundle search, token trace, or interceptor fallback.
3. **Pick auth** — `PUBLIC` / `COOKIE` / `INTERCEPT` / `UI` / `LOCAL`.
4. **Decode** response fields and design output columns.
5. `toycli browser recon analyze <url>` → `toycli browser recon init <site>/<name>` → write adapter → `toycli browser recon verify <site>/<name>`.
6. Site knowledge persists to `~/.toycli/sites/<site>/` so the next adapter for the same site starts from context.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `TOYCLI_PROFILE` | — | Browser Bridge profile alias/contextId to use when multiple Chrome profiles are connected |
| `TOYCLI_WINDOW` | command default | Set to `foreground` or `background` to override Browser Bridge window placement. Browser-backed commands also accept `--window <foreground\|background>`. |
| `TOYCLI_BROWSER_CONNECT_TIMEOUT` | `45` | Seconds to wait for browser connection |
| `TOYCLI_BROWSER_COMMAND_TIMEOUT` | `60` | Seconds to wait for a single browser command |
| `TOYCLI_CDP_ENDPOINT` | — | Chrome DevTools Protocol endpoint for remote browser or Electron apps |
| `TOYCLI_CDP_TARGET` | — | Filter CDP targets by URL substring (e.g. `detail.1688.com`) |
| `TOYCLI_VERBOSE` | `false` | Enable verbose logging (`-v` flag also works) |
| `DEBUG_SNAPSHOT` | — | Set to `1` for DOM snapshot debug output |

`toycli browser *` requires an explicit `<session>` positional, uses a foreground browser window by default, and keeps that session's tab lease until `toycli browser <session> close` or idle cleanup. Browser-backed adapters use a background adapter window and release one-shot tab leases by default. Interactive adapters can declare `siteSession: 'persistent'` to keep a stable site tab for continuity; pass `--site-session ephemeral` for a one-shot tab.

## Built-in Commands

| Site | Commands |
|------|----------|
| **xiaohongshu** | `search` `ask` `note` `comments` `feed` `user` `download` `publish` `follow` `unfollow` `notifications` `creator-notes` `creator-notes-summary` `creator-note-detail` `creator-profile` `creator-stats` |
| **bilibili** | `hot` `search` `history` `feed` `ranking` `download` `comments` `dynamic` `favorite` `following` `follow` `unfollow` `me` `subtitle` `summary` `video` `user-videos` |
| **zhihu** | `hot` `search` `question` `download` `follow` `like` `favorite` `comment` `answer` |
| **hackernews** | `top` `new` `best` `ask` `show` `jobs` `search` `user` |
| **hltv** | `search` `player-summary` `player-matches` `player-form` `player-map-pool` `player-vs-team` `player-teammate-impact` `player-duel` `match-map` `match-series` `team-matches` `team-map-pool` `event-matches` |
| **geogebra** | `eval` `add-point` `add-line` `add-circle` `add-polygon` `triangle` `hexagon` `list` `info` |
| **linkedin** | `connect` `inbox` `job-detail` `jobs-preferences` `post-analytics` `posts` `profile-experience` `profile-projects` `profile-read` `profile-analytics` `safe-send` `search` `services-read` `sent-invitations` `thread-snapshot` `timeline` `salesnav-search` `salesnav-inbox` `salesnav-message` `salesnav-thread` |
| **reddit** | `hot` `frontpage` `popular` `search` `subreddit` `read` `user` `user-posts` `user-comments` `upvote` `upvoted` `save` `saved` `comment` `subscribe` |
| **twitter** | `trending` `search` `timeline` `tweets` `lists` `list-tweets` `list-create` `list-delete` `list-add` `list-add-batch` `list-remove` `list-remove-batch` `bookmarks` `post` `download` `profile` `article` `like` `likes` `notifications` `reply` `reply-dm` `thread` `follow` `unfollow` `followers` `following` `block` `unblock` `bookmark` `unbookmark` `delete` `hide-reply` `accept` |
| **claude** | `ask` `send` `new` `status` `read` `history` `detail` |
| **gemini** | `new` `ask` `image` `deep-research` `deep-research-result` |
| **notebooklm** | `status` `list` `open` `current` `get` `history` `summary` `note-list` `notes-get` `source-list` `source-get` `source-fulltext` `source-guide` |
| **amazon** | `bestsellers` `search` `product` `offer` `discussion` `movers-shakers` `new-releases` `rankings` |
| **upwork** | `search` `feed` `detail` |
| **slock** | `message-send` `message-read` `message-search` `channel-list` `channel-info` `channel-create` `channel-members` `channel-join` `task-list` `task-create` `task-claim` `task-status` `task-convert` `task-delete` `thread-list` `thread-follow` `attachment-upload` `attachment-download` `bookmark-add` `inbox` `dm-list` `server-list` `server-use` `whoami` |
| **huodongxing** | `events` |

Curated highlights — **[→ see all 100+ supported sites & commands](./docs/adapters/index.md)** (douyin / weibo / spotify / 1688 / quark / nowcoder / google-scholar / hupu / xianyu / weread / weread-official / xiaoyuzhou / Chess.com / and more).

## CLI Hub

Unified passthrough for your existing command-line tools. Run `toycli <tool> ...` for any of:

`gh` · `docker` · `vercel` · `wrangler` · `obsidian` · `longbridge` · `lark-cli` · `ntn(notion)` · `dws(DingTalk Workspace)` · `wecom-cli(企业微信)` · `tg(tg-cli)` · `discord(discord-cli)` · `wx(wx-cli)`

Register your own with `toycli external register <name>`; list everything with `toycli external list`.

**Desktop app adapters** (Electron, via CDP): Cursor / Trae CN / Codex / Antigravity / ChatGPT App / ChatWise / Qoder / Discord / Doubao / Trae SOLO — see [`docs/adapters/desktop/`](./docs/adapters/desktop/).

## Download Support

ToyCLI supports downloading images, videos, and articles from supported platforms.

| Platform | Content Types | Notes |
|----------|---------------|-------|
| **xiaohongshu** | Images, Videos | Downloads all media from a note |
| **rednote** | Images, Videos | Downloads all media from a signed rednote note URL |
| **bilibili** | Videos | Requires `yt-dlp` installed |
| **twitter** | Images, Videos | From user media tab or single tweet |
| **douban** | Images | Poster / still image lists |
| **pixiv** | Images | Original-quality illustrations, multi-page |
| **1688** | Images, Videos | Downloads page-visible product media from item pages |
| **xiaoyuzhou** | Audio, Transcript | Downloads episode audio and transcript JSON/text with local credentials |
| **zhihu** | Articles (Markdown) | Exports with optional image download |
| **weixin** | Articles (Markdown) | WeChat Official Account articles |

For video downloads, install `yt-dlp` first: `brew install yt-dlp`

```bash
toycli xiaohongshu download "https://www.xiaohongshu.com/search_result/<id>?xsec_token=..." --output ./xhs
toycli xiaohongshu download "https://xhslink.com/..." --output ./xhs
toycli rednote download "https://www.rednote.com/search_result/<id>?xsec_token=..." --output ./rednote
toycli bilibili download BV1xxx --output ./bilibili
toycli twitter download elonmusk --limit 20 --output ./twitter
toycli 1688 download 841141931191 --output ./1688-downloads
toycli xiaoyuzhou download 69b3b675772ac2295bfc01d0 --output ./xiaoyuzhou
toycli xiaoyuzhou transcript 69dd0c98e2c8be31551f6a33 --output ./xiaoyuzhou-transcripts
```

`toycli xiaoyuzhou download` and `transcript` require local Xiaoyuzhou credentials in `~/.toycli/xiaoyuzhou.json`.

## Output Formats

All built-in commands support `--format` / `-f` with `table` (default), `json`, `yaml`, `md`, and `csv`.

```bash
toycli bilibili hot -f json    # Pipe to jq or LLMs
toycli bilibili hot -f csv     # Spreadsheet-friendly
toycli bilibili hot -v         # Verbose: show pipeline debug steps
```

## Exit Codes

toycli follows Unix `sysexits.h` so CI / scripts can branch on failure mode: `0` success, `66` empty result, `69` Browser Bridge down, `75` timeout, `77` auth required, `78` config error, `130` Ctrl-C. Full reference: [docs/guide/exit-codes.md](./docs/guide/exit-codes.md).

## Plugins

Extend ToyCLI with community-contributed adapters:

```bash
toycli plugin install github:user/toycli-plugin-my-tool
toycli plugin list
toycli plugin update --all
toycli plugin uninstall my-tool
```

| Plugin | Type | Description |
|--------|------|-------------|
| [toycli-plugin-github-trending](https://github.com/ByteYue/toycli-plugin-github-trending) | JS | GitHub Trending repositories |
| [toycli-plugin-hot-digest](https://github.com/ByteYue/toycli-plugin-hot-digest) | JS | Multi-platform trending aggregator |
| [toycli-plugin-juejin](https://github.com/Astro-Han/toycli-plugin-juejin) | JS | 稀土掘金 (Juejin) hot articles |
| [toycli-plugin-vk](https://github.com/flobo3/toycli-plugin-vk) | JS | VK (VKontakte) wall, feed, and search |

See [Plugins Guide](./docs/guide/plugins.md) for creating your own plugin.

## Testing

See **[TESTING.md](./TESTING.md)** for how to run and write tests.

## Troubleshooting

- **"Extension not connected"** — Ensure the Browser Bridge extension is installed from the [Chrome Web Store](https://chromewebstore.google.com/detail/toycli/ildkmabpimmkaediidaifkhjpohdnifk) and **enabled** in `chrome://extensions`.
- **"attach failed: Cannot access a chrome-extension:// URL"** — Another extension may be interfering. Try disabling other extensions temporarily.
- **Empty data or 'Unauthorized' error** — Your Chrome/Chromium login session may have expired. Navigate to the target site and log in again.
- **Node API errors / missing `fetch` / startup crash on old Node** — ToyCLI requires **Node.js >= 20**. Run `node --version`, upgrade Node if needed, then retry.
- **Daemon issues** — Check status: `curl localhost:19825/status` · View logs: `curl localhost:19825/logs`

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=scopai/toycli&type=Date)](https://star-history.com/#scopai/toycli&Date)

## License

[Apache-2.0](./LICENSE)

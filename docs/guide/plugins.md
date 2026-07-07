# Plugins

ToyCLI supports community-contributed plugins. Install third-party adapters from GitHub, and they're automatically discovered alongside built-in commands.

## Quick Start

```bash
# Install a plugin
toycli plugin install github:ByteYue/toycli-plugin-github-trending

# List installed plugins
toycli plugin list

# Update one plugin
toycli plugin update github-trending

# Update all installed plugins
toycli plugin update --all

# Use the plugin (it's just a regular command)
toycli github-trending repos --limit 10

# Remove a plugin
toycli plugin uninstall github-trending
```

## How Plugins Work

Plugins live in `~/.toycli/plugins/<name>/`. Each subdirectory is scanned at startup for `.ts` or `.js` command files — the same formats used by built-in adapters.

### Supported Source Formats

```bash
# GitHub shorthand
toycli plugin install github:user/repo
toycli plugin install github:user/repo/subplugin   # install specific sub-plugin from monorepo
toycli plugin install https://github.com/user/repo

# Any git-cloneable URL
toycli plugin install https://gitlab.example.com/team/repo.git
toycli plugin install ssh://git@gitlab.example.com/team/repo.git
toycli plugin install git@gitlab.example.com:team/repo.git

# Local plugin (for development)
toycli plugin install file:///path/to/plugin
toycli plugin install /path/to/plugin
```

The repo name prefix `toycli-plugin-` is automatically stripped for the local directory name. For example, `toycli-plugin-hot-digest` becomes `hot-digest`.

## Plugin Manifest (`toycli-plugin.json`)

Plugins can include an `toycli-plugin.json` manifest file at the repo root to declare metadata:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "toycli": ">=1.0.0",
  "description": "My awesome plugin"
}
```

| Field | Description |
|-------|-------------|
| `name` | Plugin name (overrides repo-derived name) |
| `version` | Semantic version |
| `toycli` | Required toycli version range (e.g. `>=1.0.0`, `^1.2.0`) |
| `description` | Human-readable description |
| `plugins` | Monorepo sub-plugin declarations (see below) |

The manifest is optional — plugins without one continue to work exactly as before.

## Monorepo Plugins

A single repository can contain multiple plugins by declaring a `plugins` field in `toycli-plugin.json`:

```json
{
  "version": "1.0.0",
  "toycli": ">=1.0.0",
  "description": "My plugin collection",
  "plugins": {
    "polymarket": {
      "path": "packages/polymarket",
      "description": "Prediction market analysis",
      "version": "1.2.0"
    },
    "defi": {
      "path": "packages/defi",
      "description": "DeFi protocol data",
      "version": "0.8.0",
      "toycli": ">=1.2.0"
    },
    "experimental": {
      "path": "packages/experimental",
      "disabled": true
    }
  }
}
```

### Installing

```bash
# Install ALL enabled sub-plugins from a monorepo
toycli plugin install github:user/toycli-plugins

# Install a SPECIFIC sub-plugin
toycli plugin install github:user/toycli-plugins/polymarket
```

### How It Works

- The monorepo is cloned once to `~/.toycli/monorepos/<repo>/`
- Each sub-plugin gets a symlink in `~/.toycli/plugins/<name>/` pointing to its subdirectory
- Command discovery works transparently — symlinks are scanned just like regular directories
- Disabled sub-plugins (with `"disabled": true`) are skipped during install
- Sub-plugins can specify their own `toycli` compatibility range

### Updating

Updating any sub-plugin from a monorepo pulls the entire repo and refreshes all sub-plugins:

```bash
toycli plugin update polymarket   # updates the monorepo, refreshes all
```

### Uninstalling

```bash
toycli plugin uninstall polymarket   # removes just this sub-plugin's symlink
```

When the last sub-plugin from a monorepo is uninstalled, the monorepo clone is automatically cleaned up.

## Version Tracking

ToyCLI records installed plugin versions in `~/.toycli/plugins.lock.json`. Each entry stores the plugin source, current git commit hash, install time, and last update time. `toycli plugin list` shows the short commit hash when version metadata is available.

## Creating a Plugin

### Creating a TypeScript Plugin

```
my-plugin/
├── package.json
├── my-command.ts
└── README.md
```

`package.json`:

```json
{
  "name": "toycli-plugin-my-plugin",
  "version": "0.1.0",
  "type": "module",
  "peerDependencies": {
    "@toy-box/opencli": ">=1.0.0"
  }
}
```

`my-command.ts`:

```typescript
import { cli, Strategy } from '@toy-box/opencli/registry';

cli({
  site: 'my-plugin',
  name: 'my-command',
  description: 'My custom command',
  access: 'read', // 'read' | 'write'
  example: 'toycli my-plugin my-command -f yaml',
  strategy: Strategy.PUBLIC,
  browser: false,
  args: [
    { name: 'limit', type: 'int', default: 10, help: 'Number of items' },
  ],
  columns: ['title', 'score'],
  func: async (kwargs) => {
    const res = await fetch('https://api.example.com/data');
    const data = await res.json();
    return data.items.slice(0, kwargs.limit).map((item: any, i: number) => ({
      title: item.title,
      score: item.score,
    }));
  },
});
```

### TS Plugin Install Lifecycle

When you run `toycli plugin install`, TS plugins are automatically set up:

1. **Clone** — `git clone --depth 1` from GitHub
2. **npm install** — Resolves regular dependencies
3. **Host symlink** — Links the running `@toy-box/opencli` into the plugin's `node_modules/` so `import from '@toy-box/opencli/registry'` always resolves against the host
4. **Transpile** — Compiles `.ts` → `.js` via `esbuild` (production `node` cannot load `.ts` directly)

On startup, if both `my-command.ts` and `my-command.js` exist, the `.js` version is loaded to avoid duplicate registration.

## Example Plugins

| Repo | Type | Description |
|------|------|-------------|
| [toycli-plugin-github-trending](https://github.com/ByteYue/toycli-plugin-github-trending) | TS | GitHub Trending repositories |
| [toycli-plugin-hot-digest](https://github.com/ByteYue/toycli-plugin-hot-digest) | TS | Multi-platform trending aggregator (zhihu, weibo, bilibili, v2ex, stackoverflow, reddit, linux-do) |
| [toycli-plugin-juejin](https://github.com/Astro-Han/toycli-plugin-juejin) | TS | 稀土掘金 (Juejin) hot articles, categories, and article feed |
| [toycli-plugin-rubysec](https://github.com/nullptrKey/toycli-plugin-rubysec) | TS | RubySec advisory archive and advisory article reader |

## Troubleshooting

### Command not found after install

Restart toycli (or open a new terminal) — plugins are discovered at startup.

### TS plugin import errors

If you see `Cannot find module '@toy-box/opencli/registry'`, the host symlink may be broken. Reinstall the plugin:

```bash
toycli plugin uninstall my-plugin
toycli plugin install github:user/toycli-plugin-my-plugin
```

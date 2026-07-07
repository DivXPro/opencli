# Homebrew

**Mode**: 🌐 Public · **Domain**: `formulae.brew.sh`

Inspect Homebrew formulae and casks, plus the official install-rank analytics, without auth or browser. Three commands.

## Commands

| Command | Description |
|---------|-------------|
| `toycli homebrew formula <name>` | Single Homebrew core formula's metadata |
| `toycli homebrew cask <token>` | Single Homebrew cask's (macOS app) metadata |
| `toycli homebrew popular` | Most-installed formulae or casks (Homebrew analytics ranking) |

## Usage Examples

```bash
# Inspect a formula
toycli homebrew formula wget
toycli homebrew formula gcc@13
toycli homebrew formula imagemagick

# Inspect a cask (macOS package)
toycli homebrew cask firefox
toycli homebrew cask visual-studio-code

# Most popular installs (defaults to formula / 30d / top 30)
toycli homebrew popular
toycli homebrew popular --type cask --window 90d --limit 50
toycli homebrew popular --type formula --window 365d --limit 100

# JSON output
toycli homebrew popular -f json
```

## Output Columns

| Command | Columns |
|---------|---------|
| `formula` | `formula, tap, version, license, description, homepage, dependencies, deprecated, disabled, source, url` |
| `cask`    | `cask, tap, name, version, description, homepage, deprecated, disabled, download, url` |
| `popular` | `rank, token, type, installs, percent, window, url` |

The `token` column from `popular` round-trips into `formula` (when `type=formula`) or `cask` (when `type=cask`).

## Options

### `homebrew formula`

| Option | Description |
|--------|-------------|
| `name` (positional) | Formula name (`wget`, `gcc@13`, `imagemagick`) |

### `homebrew cask`

| Option | Description |
|--------|-------------|
| `token` (positional) | Cask token (`firefox`, `visual-studio-code`) |

### `homebrew popular`

| Option | Description |
|--------|-------------|
| `--type` | `formula` (default) or `cask` |
| `--window` | `30d` (default) / `90d` / `365d` |
| `--limit` | Max rows (1-500, default: 30) |

## Caveats

- Formula / cask tokens are validated against Homebrew's `[A-Za-z0-9][A-Za-z0-9._+@-]*` pattern (max 100 chars). Bad input raises `ArgumentError`.
- `--type` and `--window` are validated against the only values Homebrew analytics actually publishes. Anything else raises `ArgumentError`.
- Homebrew analytics serves install counts as comma-formatted strings (`"139,972"`); we coerce them to plain numbers.
- The endpoints are static GitHub Pages JSON regenerated daily, so timestamps lag by up to 24 h.

## Prerequisites

- No browser required — uses `formulae.brew.sh/api/formula/<name>.json`, `formulae.brew.sh/api/cask/<token>.json`, and `formulae.brew.sh/api/analytics/(install|cask-install)/<window>.json`.

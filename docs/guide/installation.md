# Installation

## Requirements

- **Node.js**: >= 21.0.0, or **Bun** >= 1.0
- **Chrome** running and logged into the target site (for browser commands)

## Install via npm (Recommended)

```bash
npm install -g @toy-box/opencli
```

## Install from Source

```bash
git clone git@github.com:jackwener/toycli.git
cd toycli
npm install
npm run build
npm link      # Link binary globally
toycli list  # Now you can use it anywhere!
```

## Update

```bash
npm install -g @toy-box/opencli@latest

# If you use the packaged ToyCLI skills, refresh them too
npx skills add jackwener/toycli
```

Or refresh only the skills you actually use:

```bash
npx skills add jackwener/toycli --skill toycli-adapter-author
npx skills add jackwener/toycli --skill toycli-autofix
npx skills add jackwener/toycli --skill toycli-browser
npx skills add jackwener/toycli --skill toycli-browser-sitemap
npx skills add jackwener/toycli --skill toycli-sitemap-author
npx skills add jackwener/toycli --skill toycli-usage
npx skills add jackwener/toycli --skill smart-search
```

## Verify Installation

```bash
toycli --version   # Check version
toycli list        # List all commands
toycli doctor      # Diagnose connectivity
```

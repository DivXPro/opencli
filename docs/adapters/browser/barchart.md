# Barchart

**Mode**: 🔐 Browser · **Domain**: `barchart.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli barchart quote` | Stock quote with price, volume, and key metrics |
| `toycli barchart options` | Options chain with greeks, IV, volume, and open interest |
| `toycli barchart greeks` | Options greeks overview (IV, delta, gamma, theta, vega) |
| `toycli barchart flow` | Unusual options activity / options flow |

## Usage Examples

```bash
# Get stock quote
toycli barchart quote AAPL

# View options chain
toycli barchart options TSLA

# Options greeks overview
toycli barchart greeks NVDA

# Unusual options flow
toycli barchart flow --limit 20 -f json
```

## Prerequisites

- Chrome running and able to open `barchart.com`
- [Browser Bridge extension](/guide/browser-bridge) installed

# Binance

Access **Binance** market data from the terminal via the public API (no authentication required).

**Mode**: 🌐 Public · **Domain**: `data-api.binance.vision`

## Commands

| Command | Description |
|---------|-------------|
| `toycli binance price` | Get 24h ticker stats for one symbol |
| `toycli binance prices` | Get latest prices for all symbols |
| `toycli binance ticker` | Get 24h ticker stats for all symbols |
| `toycli binance pairs` | List exchange trading pairs |
| `toycli binance trades` | Get recent trades for one symbol |
| `toycli binance depth` | Get order-book depth for one symbol |
| `toycli binance asks` | Show ask-side depth for one symbol |
| `toycli binance klines` | Get candlestick data |
| `toycli binance top` | Show top movers by volume |
| `toycli binance gainers` | Show top gainers |
| `toycli binance losers` | Show top losers |

## Usage Examples

```bash
# One symbol, 24h stats
toycli binance price BTCUSDT

# Latest prices for all pairs
toycli binance prices

# Recent trades
toycli binance trades BTCUSDT --limit 20

# Order-book depth
toycli binance depth BTCUSDT --limit 20

# 1h candles
toycli binance klines BTCUSDT --interval 1h --limit 50

# JSON output
toycli binance top -f json
```

## Prerequisites

- No browser required — uses Binance public market-data endpoints

## Notes

- Symbols use Binance market format such as `BTCUSDT` or `ETHUSDT`
- Public market-data endpoints can still be rate-limited upstream; retry if you hit transient failures

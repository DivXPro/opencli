# Taobao

**Mode**: 🔐 Browser · **Domain**: `taobao.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli taobao search <query>` | Search Taobao products |
| `toycli taobao detail <id>` | Fetch product details |
| `toycli taobao reviews <id>` | Fetch product reviews |
| `toycli taobao cart` | View cart items |
| `toycli taobao add-cart <id>` | Add a product to cart |

## Usage Examples

```bash
# Search products
toycli taobao search "机械键盘" --limit 5

# Fetch product details
toycli taobao detail 827563850178

# Dry-run add to cart
toycli taobao add-cart 827563850178 --spec "红色 XL" --dry-run
```

## Prerequisites

- Chrome running and logged into taobao.com
- [Browser Bridge extension](/guide/browser-bridge) installed

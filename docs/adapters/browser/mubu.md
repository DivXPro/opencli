# 幕布 (Mubu)

**Mode**: 🔐 Browser · **Domain**: `mubu.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli mubu doc` | 读取文档内容（Markdown / 纯文本） |
| `toycli mubu docs` | 列出文档和文件夹 |
| `toycli mubu notes` | 读取速记（今日 / 指定日期范围） |
| `toycli mubu recent` | 最近编辑的文档 |
| `toycli mubu search` | 全文搜索文档节点 |

## Usage Examples

```bash
# Read a document in Markdown (default)
toycli mubu doc <doc-id>

# Read a document as plain text
toycli mubu doc <doc-id> --output text

# List documents in root folder
toycli mubu docs

# List starred (quick-access) documents
toycli mubu docs --starred

# List documents in a specific folder
toycli mubu docs --folder <folder-id>

# Read today's daily notes
toycli mubu notes

# Read notes for a specific date
toycli mubu notes --date 2026-04-10

# Read notes for an entire month
toycli mubu notes --month 2026-04

# List note dates with entry counts (no content)
toycli mubu notes --list --month 2026-04

# Read notes for a custom date range
toycli mubu notes --from 2026-01-01 --to 2026-03-31

# Show recently edited documents
toycli mubu recent --limit 10

# Full-text search
toycli mubu search "关键词"

# JSON output
toycli mubu docs -f json
```

## Prerequisites

- Chrome running and **logged into** mubu.com
- [Browser Bridge extension](/guide/browser-bridge) installed

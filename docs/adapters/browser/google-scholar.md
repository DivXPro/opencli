# Google Scholar

**Mode**: 🌐 Public · **Domain**: `scholar.google.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli google-scholar search <query>` | Search Google Scholar papers by keyword |
| `toycli google-scholar cite <query>` | Fetch a citation export for a Scholar search result |
| `toycli google-scholar profile <author>` | Open an author profile and list top papers |

## Usage Examples

```bash
toycli google-scholar search "transformer"
toycli google-scholar search "retrieval augmented generation" --limit 5
toycli google-scholar cite "attention is all you need" --style bibtex
toycli google-scholar profile "Yann LeCun" --limit 5
```

## Notes

- Uses browser DOM extraction over public Google Scholar results
- Availability can vary by region or anti-bot challenges

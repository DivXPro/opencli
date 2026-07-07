# IMDb

**Mode**: 🌐 Public (Browser) · **Domain**: `www.imdb.com`

## Commands

| Command | Description |
|---------|-------------|
| `toycli imdb search` | Search movies, TV shows, and people |
| `toycli imdb title` | Get movie or TV show details |
| `toycli imdb top` | IMDb Top 250 Movies |
| `toycli imdb trending` | IMDb Most Popular Movies |
| `toycli imdb person` | Get actor or director info |
| `toycli imdb reviews` | Get user reviews for a title |

## Usage Examples

```bash
# Search for a movie
toycli imdb search "inception" --limit 10

# Get movie details
toycli imdb title tt1375666

# Get TV series details (also accepts full URL)
toycli imdb title "https://www.imdb.com/title/tt0903747/"

# Top 250 movies
toycli imdb top --limit 20

# Currently trending movies
toycli imdb trending --limit 10

# Actor/director info with filmography
toycli imdb person nm0634240 --limit 5

# User reviews
toycli imdb reviews tt1375666 --limit 5

# JSON output
toycli imdb top --limit 5 -f json
```

## Prerequisites

- Chrome with Browser Bridge extension installed
- No login required (all data is public)

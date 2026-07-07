# PubMed

**Mode**: 🌐 Public · **Domain**: `pubmed.ncbi.nlm.nih.gov`

## Commands

| Command | Description |
|---------|-------------|
| `toycli pubmed search` | Search PubMed articles with filters |
| `toycli pubmed article` | Get article metadata and abstract by PMID |
| `toycli pubmed author` | Search articles by author and affiliation |
| `toycli pubmed citations` | List cited-by or reference relationships |
| `toycli pubmed related` | Find related PubMed articles |
| `toycli pubmed clinical-trial` | Search PubMed clinical trials with a preset query profile |
| `toycli pubmed review` | Search PubMed review articles with a preset query profile |
| `toycli pubmed mesh` | Search articles by MeSH term |
| `toycli pubmed journal` | Search articles by journal name |

## Usage Examples

```bash
# Search articles
toycli pubmed search "machine learning cancer" --year-from 2023 --has-abstract --limit 10

# Search by author
toycli pubmed author "Smith J" --position first --affiliation Harvard

# Read one article by PMID
toycli pubmed article 37780221 --full-abstract

# Citation relationships
toycli pubmed citations 37780221 --direction citedby --limit 20
toycli pubmed citations 37780221 --direction references --limit 20

# Related articles with scores
toycli pubmed related 37780221 --score

# Clinical trial preset
toycli pubmed clinical-trial "breast cancer" --year-from 2020 --free-full-text --limit 10

# Review preset
toycli pubmed review "immunotherapy" --year-from 2021 --has-abstract --limit 10

# Search by MeSH term
toycli pubmed mesh "Neoplasms" --major --limit 10

# Search by journal
toycli pubmed journal "Nature" --year-from 2020 --sort date --limit 10
```

## Output

Listing commands return `pmid`, `title`, `authors`, `journal`, `year`, `article_type`, `doi`, and `url` where available. The `pmid` column is the stable identifier for `toycli pubmed article <pmid>`.

`article` now returns a single structured row: `pmid`, `title`, `authors`, `journal`, `year`, `date`, `article_type`, `language`, `doi`, `pmc`, `affiliations`, `grants`, `mesh_terms`, `keywords`, `abstract`, and `url`. By default the abstract is truncated for readability; pass `--full-abstract` when you need the complete abstract text.

`clinical-trial` is a preset over the same E-utilities search path. It always adds the PubMed `Clinical Trial[PT]` and `humans[mesh]` filters, and optionally adds `free full text[sb]`.

`review` is the parallel preset for literature overviews. It always adds the PubMed `Review[PT]` filter, and can optionally require abstracts with `--has-abstract`.

## Prerequisites

- No browser required. Commands use the NCBI E-utilities public API.
- Optional: set `NCBI_API_KEY` for the higher NCBI rate limit.
- Optional: set `NCBI_EMAIL` so NCBI can identify your tool usage.

```bash
export NCBI_API_KEY=YOUR_API_KEY
export NCBI_EMAIL=you@example.com
```

## Failure Semantics

- Invalid `pmid`, `limit`, year, `sort`, `position`, `direction`, MeSH `term`, `journal`, `clinical-trial` query, or `review` query values fail before network access with `ArgumentError`.
- HTTP errors, fetch failures, invalid JSON, E-utilities error envelopes, and partial summary payloads fail with `CommandExecutionError`.
- Valid no-result searches and missing relationships fail with `EmptyResultError`.

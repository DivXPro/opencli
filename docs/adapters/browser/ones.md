# ONES

**Mode**: 🔐 Browser Bridge · **Domain**: `ones.cn` (self-hosted via `ONES_BASE_URL`)

## Commands

| Command | Description |
|---------|-------------|
| `toycli ones login` | Login via Project API (`auth/login`) |
| `toycli ones me` | Current user profile (`users/me`) |
| `toycli ones token-info` | Token/user/team summary (`auth/token_info`) |
| `toycli ones tasks` | Team task list with status/project labels and hours |
| `toycli ones my-tasks` | My tasks (`assign`/`field004`/`owner`/`both`) |
| `toycli ones task` | Task detail by UUID (`team/:team/task/:id/info`) |
| `toycli ones worklog` | Log/backfill hours (GraphQL `addManhour` first, then REST fallbacks) |
| `toycli ones logout` | Logout (`auth/logout`) |

## Usage Examples

```bash
# Required: your ONES base URL
export ONES_BASE_URL=https://your-instance.example.com

# Optional if your deployment requires auth headers
# export ONES_USER_ID=...
# export ONES_AUTH_TOKEN=...

# Login/profile
toycli ones login --email you@company.com --password 'your-password'
toycli ones me
toycli ones token-info

# Task lists
toycli ones tasks <teamUUID> --limit 20
toycli ones tasks <teamUUID> --project <projectUUID> --assign <userUUID>
toycli ones my-tasks <teamUUID> --limit 100
toycli ones my-tasks <teamUUID> --mode both

# Task detail
toycli ones task <taskUUID> --team <teamUUID>

# Worklog: today / backfill
toycli ones worklog <taskUUID> 2 --team <teamUUID>
toycli ones worklog <taskUUID> 1.5 --team <teamUUID> --date 2026-03-23 --note "integration"

toycli ones logout
```

## Prerequisites

- Chrome running and logged into your ONES instance
- [Browser Bridge extension](/guide/browser-bridge) installed
- `ONES_BASE_URL` set to the same origin opened in Chrome

## Notes

- This adapter targets legacy ONES Project API deployments.
- `ONES_TEAM_UUID` can be set to omit `--team` in `tasks` / `my-tasks` / `task`.
- Hours display and input use `ONES_MANHOUR_SCALE` (default `100000`).

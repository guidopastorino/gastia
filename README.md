# gastia

Expo (React Native + TypeScript) app with Supabase email/password auth.

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill `.env` with your Supabase URL and publishable (anon) key, either from a
cloud project or from the local stack below.

## Local Supabase (requires Docker)

```bash
pnpm supabase:init      # first time only, creates ./supabase
pnpm supabase:start     # starts the local stack
pnpm supabase:status    # prints the URL and keys for .env
pnpm supabase:stop
```

On a physical device, replace `127.0.0.1` in `EXPO_PUBLIC_SUPABASE_URL` with
your computer's LAN IP.

## Run the app

```bash
pnpm start
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm start` / `ios` / `android` / `web` | Run the Expo app |
| `pnpm typecheck` | TypeScript check |
| `pnpm supabase <args>` | Any Supabase CLI command |
| `pnpm supabase:init` | Initialize `./supabase` |
| `pnpm supabase:start` / `stop` / `status` | Manage the local stack |
| `pnpm supabase:reset` | Recreate the local DB from migrations and seed |
| `pnpm supabase:migration <name>` | Create a new migration |
| `pnpm supabase:diff` | Diff local DB changes into SQL |
| `pnpm supabase:link --project-ref <ref>` | Link a cloud project |
| `pnpm supabase:push` | Apply migrations to the linked project |
| `pnpm supabase:types` | Generate `src/lib/database.types.ts` from the local DB |

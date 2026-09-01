# AaravNRI — Setup

## 1. Prerequisites

- Node.js 18.18 or later
- A Supabase project
- A Groq API key

## 2. Install

```bash
npm install
cp .env.local.example .env.local
```

## 3. Supabase

**Project Settings → API** gives you:

| Value | Variable |
|-------|----------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` (server-only) |

The service-role key must never be given a `NEXT_PUBLIC_` prefix. It bypasses
row-level security entirely.

## 4. Database

Run `supabase/migrations/0001_init.sql` in the SQL Editor. It is ordered so it
executes top to bottom on an empty project — functions are defined before the
triggers that call them, and parent tables before their children.

Then set the retention window and schedule the purge:

```sql
alter database postgres set app.retention_days = '30';

-- Requires the pg_cron extension (Database → Extensions).
select cron.schedule('purge-analyses', '0 * * * *', 'select public.purge_expired()');
```

Seed the programme table from `data/programmes.json`, or keep reading it from
the file — the API route uses the file by default.

## 5. Auth

**Authentication → Providers → Email**: enable, with *Confirm email* on.

**Authentication → URL Configuration**: set the Site URL and add
`http://localhost:3000/auth/callback` plus your production callback.

## 6. Groq

Create a key at https://console.groq.com/keys. `GROQ_MODEL` defaults to
`llama-3.3-70b-versatile`; check the console for the current model list, as
Groq retires model IDs periodically.

All Groq calls are server-side. The key is never sent to the browser.

## 7. Run

```bash
npm run test     # security and scoring assertions
npm run dev
```

## 8. Deploy

Push to GitHub and import in Vercel. Add every variable from `.env.local` under
**Settings → Environment Variables**, then add the production `/auth/callback`
URL to the Supabase redirect list.

# My Diary

App di journaling personale — una pagina al giorno.

## Setup

1. Create a Supabase project and run the SQL in `docs/supabase-schema.sql`
2. Copy `.env.local.example` to `.env.local` and fill in values:
   - `DIARY_TOKEN`: run `openssl rand -hex 32` to generate
   - `NEXT_PUBLIC_SUPABASE_URL`: from Supabase project settings → API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: from Supabase project settings → API

## Access

Visit `https://your-app.vercel.app/<DIARY_TOKEN>` to log in.
After the first visit, the token is stored in a cookie for 1 year.

## Deploy on Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard (same as `.env.local`):
   - `DIARY_TOKEN`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Development

```bash
npm install
npm run dev
```

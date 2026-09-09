# EgyMedya Lead Studio

A Next.js lead collection platform with Supabase PostgreSQL, a protected admin workspace, server-side pagination, validation, duplicate protection, and Excel export.

## Local setup

1. Copy `.env.example` to `.env` and set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long `SESSION_SECRET`.
2. Run `npm install`.
3. In Supabase SQL Editor, run `supabase/migrations/001_create_submissions.sql` once. It creates the indexed `submissions` table and enables RLS with no public read access.
4. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env` from Supabase Dashboard -> Project Settings -> API. This key is server-only and must never use a `NEXT_PUBLIC_` prefix.
5. Run `npm run dev` and visit `http://localhost:3000`.

The public form is at `/`. The protected workspace is at `/admin`. The form endpoint validates again on the server and rejects duplicate email or phone submissions received within 24 hours. Admin credentials are environment-only and are never sent to the client.

## Production notes

Use Supabase PostgreSQL through the server-only Supabase client, a cryptographically random `SESSION_SECRET`, HTTPS, and a platform rate limiter or edge firewall. Never commit `.env` or expose the database password, service-role key, or full `DATABASE_URL` to the browser. A Turnstile token can be added to the `submissionSchema` and POST route without changing the UI/data model.
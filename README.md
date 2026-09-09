# Ultimate Money Planner Web

Public web dashboard starter based on the Ultimate Money Planner Excel product.

## What is included

- Passwordless email login through Supabase magic links
- Private dashboard shell for income, expenses, savings, and net worth
- User-owned monthly summaries and transactions
- Database row-level security policies that isolate every user's data
- Visual language aligned to the seller package: charcoal, ivory, teal, and a calm finance dashboard

## Go live

1. Create a Supabase project and open its SQL editor.
2. Run `supabase/schema.sql` once.
3. In Supabase Authentication, enable Email sign-in and add your production URL plus `http://localhost:3000/auth/callback` as redirect URLs.
4. Copy `.env.example` to `.env.local`, then set the project URL and publishable key.
5. Install dependencies with `pnpm install` and preview with `pnpm dev`.
6. Deploy to Vercel, then add the deployed URL to Supabase's allowed redirect URLs.

Use only the Supabase publishable key in the browser. Never put a service-role key in this project.

## Project layout

- `app/` — Next.js App Router routes: landing page, `/login`, `/auth/callback`, and the protected `/dashboard` section
- `components/` — presentational and client components used by the dashboard and auth pages
- `lib/` — Supabase client/server helpers, formatting utilities, and shared types
- `middleware.ts` — refreshes the Supabase session and guards `/dashboard`
- `supabase/schema.sql` — tables and row-level security policies for profiles, monthly summaries, transactions, budget items, savings goals, and debts

# Ultimate Money Planner Web

Public web dashboard starter based on the Ultimate Money Planner Excel product.

## What is included

- Passwordless email sign-in links through Firebase Authentication
- Private dashboard shell for income, expenses, savings, and net worth
- User-owned monthly summaries and transactions stored in Firestore
- Firestore security rules that isolate every user's data under `users/{uid}/...`
- Visual language aligned to the seller package: charcoal, ivory, teal, and a calm finance dashboard

## Go live

1. Create a project at [the Firebase console](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → enable **Email link (passwordless sign-in)**. Under Settings → Authorized domains, make sure `localhost` and your production domain are both listed.
3. **Firestore Database** → create a database (production mode is fine — the rules below lock it down). Open the Rules tab, paste in the contents of `firestore.rules`, and Publish. (Or, with the Firebase CLI installed and logged in: `firebase deploy --only firestore:rules`.)
4. **Project settings → General** → add a Web app if you haven't, then copy its config values into the `NEXT_PUBLIC_FIREBASE_*` variables below.
5. **Project settings → Service accounts** → Generate new private key. Use the downloaded JSON's `project_id`, `client_email`, and `private_key` for the `FIREBASE_*` (non-public) variables below.
6. Copy `.env.example` to `.env.local` and fill in all seven values. `FIREBASE_PRIVATE_KEY` is multi-line PEM text — paste it as-is (with its literal `\n` sequences); the app un-escapes them at startup.
7. Install dependencies with `pnpm install` and preview with `pnpm dev`.
8. Deploy to Vercel: add the same seven environment variables under Project → Settings → Environment Variables, then add your Vercel domain to Firebase Authentication's Authorized domains.

Only the `NEXT_PUBLIC_FIREBASE_*` values are ever sent to the browser — that's expected, they identify the Firebase project, not a secret. The service account credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) are used only by the Firebase Admin SDK on the server and must never reach client code.

## Populating data

Three collections don't have an in-app editor yet — add documents for them directly in the Firestore console under `users/<your-uid>/...` (find your uid in Authentication → Users after your first sign-in):

- `monthlySummaries/<id>` — e.g. id `2026-01`, fields `year` (number), `month` (number, 1-12), `income`, `expenses`, `savings`, `debtBalance`, `netWorth` (all numbers)
- `budgetItems/<id>` — e.g. id `2026-01-housing`, fields `year`, `month`, `category` (string), `budgeted`, `actual` (numbers)
- `savingsGoals/<auto-id>` — fields `name` (string), `targetAmount`, `currentAmount` (numbers), optional `targetDate`
- `debts/<auto-id>` — fields `name` (string), `initialBalance`, `currentBalance` (numbers)

`transactions` has a full add/delete UI at `/dashboard/transactions` — no manual setup needed there.

## Project layout

- `app/` — Next.js App Router routes: landing page, `/login`, `/auth/callback` (completes the Firebase email-link sign-in), and the protected `/dashboard` section
- `app/api/auth/session/route.ts` — issues and clears the httpOnly session cookie after client-side Firebase sign-in
- `components/` — presentational and client components used by the dashboard and auth pages
- `lib/firebase/` — Firebase client SDK (`client.ts`) and Admin SDK (`admin.ts`, server-only) setup
- `lib/session.ts` — server-only helper that verifies the session cookie via Firebase Admin
- `middleware.ts` — a fast, unverified cookie-presence check that redirects unauthenticated visitors away from `/dashboard`; the real verification happens on every protected page via `lib/session.ts`, since Firebase Admin cannot run in Edge middleware
- `firestore.rules` — security rules scoping every document under `users/{uid}/...` to that user

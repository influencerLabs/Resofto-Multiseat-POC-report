# Resofto Multi-Seat Solution

POC Management & Validation Platform built with Next.js, Supabase and Vercel.

## Environment variables

Set these in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Database

Create the nine Supabase tables described in the deployment guide and configure RLS policies before production use.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Push to GitHub and connect the repository to Vercel.

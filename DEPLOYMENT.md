# Deploying MultiMey Supplies to Vercel

This guide explains how to deploy your Next.js application to Vercel.

## 1. Push to GitHub (Done)
The latest code has already been pushed to your GitHub repository:
`https://github.com/sasusavage/barnsPerfume`

## 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Select **Import** next to your repository `barnsPerfume` (linked to `sasusavage`).
   - If you don't see it, ensure your GitHub account is connected and permissions are granted for this repo.

## 3. Configure Project
In the "Configure Project" screen:
- **Framework Preset**: Next.js (should be auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `next build` (default) (or `npm run build` which is alias)

## 4. Environment Variables (CRITICAL)
Expand the **Environment Variables** section and add the following keys. 
Copy the values from your local `.env.local` file (or use production values where appropriate).

| Key | Value Source | Note |
|-----|--------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` | **Keep Secret!** Used for Admin API routes. |
| `NEXT_PUBLIC_APP_URL` | Check Deployment | Start with `https://multimey-supplies.vercel.app` (or whatever domain Vercel assigns). Use `http://localhost:3000` for development. |
| `MOOLRE_SMS_API_KEY` | `.env.local` | (If available) |
| `MOOLRE_API_USER` | `.env.local` | (If available) |
| `MOOLRE_API_PUBKEY` | `.env.local` | (If available) |
| `MOOLRE_ACCOUNT_NUMBER` | `.env.local` | (If available) |
| `RESEND_API_KEY` | `.env.local` | (If using Resend for emails) |
| `ADMIN_EMAIL` | `.env.local` | |
| `EMAIL_FROM` | `.env.local` | |

**Tip:** You can often copy-paste the entire content of `.env.local` into the Vercel interface (click "Edit using plain text" if available, or add one by one).

## 5. Deploy
Click **Deploy**.
Vercel will build your application. This may take a few minutes.

## 6. Post-Deployment Checks
- Verify the homepage loads and banners display correctly.
- Test the Admin Login (`/auth/login`).
- Verify Site Settings in Admin (`/admin/settings`).
- Check uploaded images (Logos/Banners). If using Supabase Storage, ensure your bucket policies are public (which we configured).

## Troubleshooting
- **404 on Images**: Ensure the domain is allowed in `next.config.ts` (we have `*.supabase.co` allowed).
- **500 Errors**: Check Vercel **Logs** tab for server-side errors (often missing Environment Variables).

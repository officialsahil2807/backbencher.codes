# Backbencher.codes — Supabase & AdSense Integration Guide

This guide explains how to set up **Supabase Authentication**, **Database synchronization**, and **Google AdSense monetization** for your application.

---

## 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create or open your project.
2. In your Supabase Dashboard, navigate to **Project Settings** (gear icon) → **API**.
3. Copy your project credentials:
   - **Project URL**
   - **Project API Keys**:
     - `anon` `public` key
     - `service_role` key (keep secret!)

4. Open `.env.local` in this project and paste your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Run Database & Security Schema

1. In your Supabase Dashboard, open the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Copy the entire contents of [`src/lib/supabase/schema.sql`](file:///c:/Users/SAHIL/Desktop/webbb/src/lib/supabase/schema.sql).
4. Paste it into the SQL editor and click **Run**.
5. This automatically creates:
   - `site_settings` table (stores AdSense keys, slots, and master switches with Row-Level Security).
   - `posts` table (stores blog articles with Row-Level Security).
   - Public read policies (so visitors can read published posts and ad configuration).
   - Admin write policies (so only authenticated admins can create/update/delete).

---

## 3. Create Your Supabase Admin Account

1. In your Supabase Dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Fill in:
   - **Email**: Your admin email (e.g., `admin@yourdomain.com`)
   - **Password**: A strong password (minimum 6 characters)
   - Check **Auto Confirm User?** (so you can sign in immediately without email confirmation).
4. Click **Create User**.
5. You can now log into [`/admin/login`](http://localhost:3000/admin/login) using your Supabase email and password!

---

## 4. Strict Route Protection & Password Protection

- **Edge Middleware Protection**: Any unauthorized visitor trying to access `/admin`, `/admin/posts`, `/admin/posts/new`, or `/admin/posts/[id]/edit` is immediately intercepted and redirected to `/admin/login`.
- **Server Component Guard**: Admin layouts and pages verify sessions on the server before rendering, preventing any sensitive HTML or UI leaks.
- **Brute-Force Rate Limiting**: 5 consecutive failed login attempts locks access for 15 minutes.
- **Fail-safe Backup PIN**: If your Supabase credentials are pending or being rotated, you can also sign in using your `ADMIN_SECURITY_PIN` (default: `849201`, configured in `.env.local`).

---

## 5. Google AdSense Key & Environmental Variables

When you receive approval from **Google AdSense**, you receive a Publisher ID formatted as:
`ca-pub-XXXXXXXXXXXXXXXX` (e.g. `ca-pub-1234567890123456`).

You can configure it using **any** of the following methods:

### Method A: Live via Admin Dashboard (Recommended - No redeployment needed!)
1. Sign in to [`/admin`](http://localhost:3000/admin).
2. Click the **Google AdSense & Monetization** tab.
3. Turn the switch **Enable Google AdSense Advertisements** to **ON**.
4. Enter your Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`).
5. Click **Save AdSense Settings**.
6. This saves directly to your Supabase `site_settings` table and activates ads across all placements immediately!

### Method B: In Supabase Environmental Variables / Secrets
If you are deploying Supabase Edge Functions or using Supabase Vault:
1. In Supabase Dashboard, go to **Project Settings** → **Edge Functions** / **Vault** → **Secrets**.
2. Add the environmental variables:
   - Name: `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`, Value: `ca-pub-XXXXXXXXXXXXXXXX`
   - Name: `NEXT_PUBLIC_ADS_ENABLED`, Value: `true`

### Method C: In Hosting Environment (.env.local / Vercel / Netlify)
Add to your environment variables:
```env
NEXT_PUBLIC_ADS_ENABLED=true
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-1234567890123456
```

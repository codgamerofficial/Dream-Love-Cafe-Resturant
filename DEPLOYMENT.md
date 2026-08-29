# Dream Love Cafe & Restaurant — Web & Mobile Deployment Guide

This guide details how to deploy the production static web app (`dist/`) and configure hosting platforms for **Dream Love Cafe & Restaurant**.

---

## 1. Web Deployment Options

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (Optional):
   ```bash
   npm i -g vercel
   ```
2. **Deploy via CLI**:
   ```bash
   vercel --prod
   ```
3. **Or Deploy via Vercel Dashboard**:
   - Push your codebase to GitHub / GitLab / Bitbucket.
   - Import the repository into Vercel.
   - Framework Preset: **Other** or **Expo**.
   - Build Command: `npm run build:web`
   - Output Directory: `dist`
   - Vercel will automatically read [vercel.json](file:///d:/DLC&R/vercel.json) for SPA route fallback and security headers.

---

### Option B: Deploy to Netlify

1. **Install Netlify CLI** (Optional):
   ```bash
   npm i -g netlify-cli
   ```
2. **Deploy via CLI**:
   ```bash
   netlify deploy --prod --dir=dist
   ```
3. **Or Deploy via Netlify Dashboard**:
   - Connect repository to Netlify.
   - Build Command: `npm run build:web`
   - Publish Directory: `dist`
   - Netlify will automatically read [netlify.toml](file:///d:/DLC&R/netlify.toml) for SPA rewrites (`/* -> /index.html 200`).

---

### Option C: Deploy to Cloudflare Pages

1. **Deploy via Wrangler CLI**:
   ```bash
   npx wrangler pages deploy dist --project-name=dream-love-restaurant
   ```
2. **Or via Cloudflare Dashboard**:
   - Create a project under **Workers & Pages**.
   - Build Command: `npm run build:web`
   - Build Output Directory: `dist`
   - Add Single Page App redirect rule: `/* -> /index.html`.

---

## 2. Environment Variables

Configure the following environment variables in your hosting dashboard:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://your-project.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon API Key | `eyJhbGciOi...` |
| `EXPO_PUBLIC_RESTAURANT_PHONE` | Direct Phone Number | `+91 99333 88167` |
| `EXPO_PUBLIC_RESTAURANT_WHATSAPP` | WhatsApp Order Target | `+919933388167` |

---

## 3. Mobile Deployment (iOS & Android)

### Android APK / AAB Build:
```bash
npx eas build --platform android --profile production
```

### iOS TestFlight / App Store Build:
```bash
npx eas build --platform ios --profile production
```

---

## 4. Verification

After deployment, verify that all pages resolve cleanly:
- `/` — Homepage
- `/menu` — Digital Menu with filters & cart
- `/book` — Online Table Reservation Form
- `/about` — Restaurant Concept & Philosophy
- `/gallery` — Editorial Photo Gallery
- `/reviews` — Verified Google Rating Box
- `/contact` — Map & Plus Code Details
- `/admin` — Protected Management Portal (Requires authorized staff authentication)

# Sonder Photography — Portfolio Website

A warm-minimal photography portfolio built with **Next.js 14**, **Sanity CMS**, and **Tailwind CSS**.

---

## Quick Start (local development)

### Prerequisites
- [Node.js 20+](https://nodejs.org/) installed
- A free [Sanity.io](https://sanity.io) account
- A free [Formspree](https://formspree.io) account (for the contact form)

---

### Step 1 — Install dependencies

```bash
npm install
```

---

### Step 2 — Create your Sanity project

1. Go to [sanity.io/manage](https://sanity.io/manage) → **Create new project**
2. Name it `Sonder Photography`
3. Choose the **production** dataset
4. Copy your **Project ID** from the project dashboard

---

### Step 3 — Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123          # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Optional — only needed for draft previews:
SANITY_API_READ_TOKEN=your_token_here

# Contact form (free at formspree.io):
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your_id
```

---

### Step 4 — Add your domain to Sanity CORS

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS origins**
2. Add `http://localhost:3000` (for local dev)
3. Later, add your Vercel URL and custom domain

---

### Step 5 — Run the dev server

```bash
npm run dev
```

- **Site:** [http://localhost:3000](http://localhost:3000)
- **Sanity Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

---

## Using the Studio (Photographer guide)

1. Open your site URL followed by `/studio` (e.g. `https://sonderphotography.com/studio`)
2. Log in with your Sanity account
3. **First time setup:**
   - Click **Site Settings** → fill in your tagline, hero images, about text, social links
   - Click **Categories** → create your categories (Weddings, Couples, Family, Housewarming)
   - Add a cover image to each category
4. **After every shoot:**
   - Click **Photos** → **Create new photo**
   - Upload the JPEG, select the category, add alt text, hit **Publish**
   - Photos appear on your site instantly — no code needed

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial Sonder Photography site"
git remote add origin https://github.com/YOUR_USERNAME/sonder-photography.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects Next.js — click **Deploy**

### Step 3 — Add environment variables on Vercel

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_READ_TOKEN` | your read token |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | your Formspree URL |

### Step 4 — Add Vercel URL to Sanity CORS

1. Copy your Vercel URL (e.g. `https://sonder-photography.vercel.app`)
2. Go to [sanity.io/manage](https://sanity.io/manage) → API → CORS origins
3. Add the Vercel URL (and later your custom domain)

### Step 5 — Connect custom domain

1. In Vercel → **Settings** → **Domains** → add your domain
2. Follow the DNS instructions (add a CNAME or A record at your registrar)

---

## Connecting a Custom Domain (Namecheap / Cloudflare)

**Cloudflare Registrar (recommended):**
1. Add your domain to Cloudflare
2. In Vercel, get the nameservers shown under your domain
3. Update nameservers at your registrar to point to Cloudflare
4. Add a CNAME record: `@` → your Vercel deployment URL

**Namecheap:**
1. In Namecheap → **Advanced DNS**
2. Add an A record: `@` → `76.76.21.21` (Vercel's IP)
3. Add a CNAME: `www` → `cname.vercel-dns.com`

---

## Monthly Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel (Hobby) | Free |
| Sanity (Free plan, up to 10 users, 10GB assets) | Free |
| Domain (Cloudflare Registrar or Namecheap) | ~$1.25/mo |
| Formspree (Free, 50 submissions/mo) | Free |
| **Total** | **~$1.25/mo** |

---

## Site Structure

```
/               Home — hero crossfade, category preview, CTA
/gallery        Category grid
/gallery/[slug] Masonry photo grid with lightbox
/about          Photographer bio
/contact        Booking/inquiry form
/studio         Sanity Studio (CMS — for photographer only)
```

---

## Tech Stack

- **Next.js 14** (App Router, server components, ISR)
- **Sanity v3** (headless CMS, embedded studio at `/studio`)
- **Tailwind CSS** (warm minimalism design system)
- **next-sanity** (typed GROQ queries, image optimization)
- **Formspree** (contact form email delivery)
- **Vercel** (hosting, CDN, automatic deploys from GitHub)

---

## Customising the Design

All colours are in `tailwind.config.ts`:

```ts
canvas:     "#1a1614"   // background
ivory:      "#f5f0eb"   // text
gold:       "#c9a96e"   // accent
muted:      "#9a8f85"   // secondary text
```

Fonts are loaded via `next/font/google` in `app/layout.tsx`:
- **Playfair Display** — serif wordmark + headings
- **Inter** — body text

---

## Logo

Replace the text wordmark in `components/Header.tsx` with your logo:

```tsx
// Current (text):
<span className="font-serif text-xl tracking-widest">SONDER</span>

// With logo image:
<Image src="/logo.svg" alt="Sonder Photography" width={120} height={40} />
```

Place your logo file in the `/public` folder.

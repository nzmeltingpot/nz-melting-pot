# Deploying changes to nzmeltingpot.com

## The two-step workflow

After making changes locally:

### 1. Push to GitHub

```
git push origin main
```

(Goes to https://github.com/nzmeltingpot/nz-melting-pot)

### 2. Ask the EzSite assistant to pull

Send them this short message:

> **Please pull and sync from main.**

That's it. They'll fetch from GitHub and check out the frontend files into the live project. EzSite auto-deploys on the internal git change. Usually takes 1–2 minutes.

---

## If the EzSite assistant needs a full instruction (fallback)

> Please run these commands from the project root and confirm EzSite has redeployed:
>
> ```
> git fetch https://github.com/nzmeltingpot/nz-melting-pot.git main
> git checkout FETCH_HEAD -- src/ public/ scripts/ index.html package.json package-lock.json vite.config.js .gitignore .env.example
> ```
>
> Leave `__easysite_nodejs__/` untouched — those are the EzSite-side Deno functions for Stripe / Brevo / Resend.

---

## Verifying the deploy worked

The JS bundle hash in the live HTML changes on each deploy. Quick check from a terminal:

```
curl -s https://www.nzmeltingpot.com/musical-talent-showcase | grep -oE "assets/index-[A-Za-z0-9_-]+\.js"
```

If the hash differs from the previous deploy, the new code is live. Hard-refresh the page in your browser (Ctrl+Shift+R / Cmd+Shift+R).

---

## What's in this repo vs what's on EzSite only

| Lives in this repo | Lives only on EzSite (don't try to push from here) |
|---|---|
| All frontend code (`src/`, `public/`, `scripts/`, root config) | Database tables (bookings, members, settings) |
| Poster generator + variants (`public/posters/`) | Environment variables (`BREVO_API_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`) |
| Backend Deno functions (`__easysite_nodejs__/`) — versioned for safety, but EzSite owns the canonical copy | Stripe webhook URL, DNS for nzmeltingpot.com, admin user accounts |

---

## ⚠️ One-way sync — beware

The pull is **one-way only**: GitHub → EzSite. Changes made directly on EzSite do **NOT** flow back to GitHub or to local automatically.

**Rule of thumb:** treat local + GitHub as the single source of truth. Make all changes there, even tiny ones (typos, copy tweaks).

If you absolutely have to fix something on EzSite directly (emergency only):
1. Make the change on EzSite.
2. Immediately ask the EzSite assistant to commit + push that change back to `nzmeltingpot/nz-melting-pot` `main`.
3. Run `git pull origin main` locally before doing any further work.

If you skip step 2, your EzSite-side fix will be silently overwritten on the next deploy from local.

---

## Repo trivia

- Active repo: `https://github.com/nzmeltingpot/nz-melting-pot`
- Old repo (deleted): `nzmp_website` — don't try to use it
- EzSite project root path: `/mnt/sandbox/1089488/project`

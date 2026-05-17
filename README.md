# KRYONIS — Civilization Discovery Engine

Production site for **kryonis.global**.

## Structure

```
kryonis-global/
├── index.html              — Doctrine + Engine + Registry + Ecosystem + Horizon + Method
├── engine.html             — Seven agent classes, deep dive
├── registry.html           — Full hypothesis registry (H-001 to H-007)
├── ecosystem.html          — Four-domain map with detail
├── correspondence.html     — Written introduction form
├── 404.html                — Off-the-map page
├── styles.css              — Full design system
├── script.js               — Reveals, filter, mobile nav, form
├── CNAME                   — kryonis.global (GitHub Pages custom domain)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── images/             — Hero atmosphere + section visuals (JPG)
    ├── og/                 — Open Graph social cards (1200×630 JPG, one per page)
    └── icons/              — favicon SVG/PNG + apple-touch-icon
```

## Deployment (GitHub Pages — same as triinlellep.studio, yichamber.com)

1. **Create repository** under `StevenAlber`:
   - Name: `kryonis-global` (or any name — domain comes from CNAME)
   - Public

2. **Upload contents** — drag entire `kryonis-global/` folder contents (NOT the folder itself) to repo root.
   Repo root should contain `index.html`, `assets/`, `CNAME` etc. directly.

3. **Enable Pages**:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / folder: `/ (root)`
   - Save

4. **Custom domain**:
   - The `CNAME` file is already in the repo; GitHub will pick `kryonis.global` automatically.
   - Wait for the green check.
   - Enable "Enforce HTTPS".

5. **Gandi DNS** (kryonis.global zone):
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   stevenalber.github.io.
   ```
   (Replace `stevenalber.github.io.` with the actual GitHub username if different — note trailing dot.)

6. **First load**: HTTPS provisioning takes 5–30 minutes.

## Design system

- **Display:** Fraunces (variable serif, optical sizing)
- **Body:** EB Garamond
- **Mono:** JetBrains Mono
- All from Google Fonts, preconnected

**Palette:**
| Token | Hex |
|---|---|
| `--carbon` | `#0B0D0C` (background) |
| `--graphite` | `#14171A` |
| `--abyss-green` | `#102A22` |
| `--pine` | `#1A2E25` |
| `--gold` | `#B8935E` (primary accent) |
| `--gold-bright` | `#D4B27A` |
| `--ivory` | `#E8E3D6` (body text) |

## Channel discipline

Per KRYONIS doctrine:
- No Russian institutional channel names visible (Vasilov, ОБР, TRIM, Roscongress) — all internal.
- Hypothesis Registry shows neutral maturity statuses only (`Concept Formed → Evidence Mapping → Novelty Review → Simulation Pathway → Prototype Ready`). Never `Institutional Track` or `Partner Review`.
- Each ecosystem domain links out (kryonislab.org, bccs.bio, bioclearing.global) — kryonis.global does not absorb their content.

## SEO / Social

- Each page has its own `<title>`, meta description, canonical URL, Open Graph tags, Twitter card.
- Each page has its own OG image (1200×630 JPG) in `/assets/og/`.
- Theme color: `#0B0D0C` (matches body background; clean mobile address bar).
- Favicons: SVG (primary, scales perfectly) + 16/32/180 PNG fallbacks.

## Performance

- No frameworks, no build step. Static HTML/CSS/JS.
- Single CSS file, single JS file.
- Fonts preconnected.
- `prefers-reduced-motion` respected.
- IntersectionObserver for scroll reveals (graceful fallback).

---

© KRYONIS Sovereign Systems Limited · Hong Kong

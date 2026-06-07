# Compari Price

Compari Price is a simple phone-first PWA for comparing the value of two similar products by cost per quantity or weight.

## Features

- Compare two products by normalized unit price.
- Supports free-text quantities like `4 x 330ml`, `500ml`, `1.5L`, `250g`, `2kg`, and `12 items`.
- Shows the better-value product, effective unit price, and saving.
- Installable PWA with offline app shell caching.
- Build label is visible in the UI.

## Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

For GitHub Pages builds, set `GITHUB_PAGES=true` so Vite uses `/COMPARI-PRICE/` as the base path:

```powershell
$env:GITHUB_PAGES='true'; npm run build
```

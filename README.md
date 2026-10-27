# Vintage Fashion — storefront template

A 70s clothing rack for second-hand and vintage clothing, boutiques and
alterations: products hang on hangers and swing on hover or focus, categories
are size dividers on the rail, prices are garment tags. Design plan:
[`DESIGN.md`](DESIGN.md).

## How it works

React 18 + Vite + Tailwind. Everything the store shows is data — branding,
CMS copy (`home`, `about`, `products`, `contact`), products and services,
categories, contact — read through `src/core/`, vendored from the monorepo's
`templates/_core` (do not edit it here). Template code is the design:
`src/components`, `src/pages`, `src/theme`, `src/i18n`.

`/config.json`: `{ "mode": "demo", "templateId": … }` shows the template's demo
rows; a provisioned store gets `{ "mode": "live", "orgId": … }`.

## Pages

`/` · `/products` (`?type=`, `?category=`, `?sale=1`, `?q=`, `?sort=`) ·
`/products/:id` · `/about` · `/contact` · 404. Old URLs (`/deals`,
`/services`, `/category/:slug`…) redirect into the catalog.

## Effects

CSS only: garments and dividers swing on hover/focus, the hero piece swings
once as it is hung. `prefers-reduced-motion` and `?motion=reduce` stop all of
it; nothing depends on it.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc + vite build → dist/
```

Against a local management-be: `TSURU_DEV_API=http://localhost:5000
VITE_PUBLIC_API_URL=http://localhost:5173 pnpm dev`.

## Deployment

`.github/workflows/deploy.yml`: `develop` → GitHub Pages
(`vintage-fashion.examples.tsuru.jcampos.dev`, staging); `main` → production
example hosting; each deploy notifies the provisioner to refresh stores using
this template.

# DevBlog — your-blog-nuxt4 (Developer Blog)

> Category: Blog Template · Live: https://your-blog-sh1r00-623.netlify.app

## Functionality

A technical developer blog with a code-editor / dark-code theme and syntax-highlighted posts. Blog posts are stored in a static TypeScript array (`app/data/blogPosts.ts`) and rendered through dynamic routes, with category/tag listing and a search page. It also ships a contact page, dark mode, a PWA install prompt, and i18n across three locales.

- **Public pages** — `app/pages/index.vue` (home + inline search), `app/pages/about.vue`, `app/pages/blog/[slug].vue`, `app/pages/categories/[category].vue`, `app/pages/tags/[tag].vue`, `app/pages/search.vue`, `app/pages/contact.vue`.
- **Components** — atoms (`ABaseButton`, `ABlogCard`, `ADarkModeToggle`, `AIcon`) and organisms (`OHeader`, `OFooter`), plus `PwaInstallPrompt.vue`.
- **Composables** — `useBlogSearch.ts` (search), `useEmail.ts` (contact form), `darkMode.ts`, `pwaInstall.ts`.
- **Also included** — dark mode (SSR-safe via Pinia + `useCookie`), PWA (offline + install prompt), i18n (3 locales), `fuse.js` (search dependency).

## Stack

- Nuxt 4 (`compatibilityVersion: 4`), Vue 3 `<script setup>`, TypeScript
- Tailwind CSS v3.4 (`@nuxtjs/tailwindcss` v6) — M3 dark code-editor theme, `darkMode: 'class'`
- Pinia (stores: `darkMode`, `pwaInstall`)
- `@nuxtjs/i18n` v10 — 3 locales (English, Español, አማርኛ), `strategy: 'prefix'`, `lazy: true`
- `@vite-pwa/nuxt` — service worker, offline caching, installable manifest
- `nuxt-security` — CSP (nonce-based), rate limiter, XSS validator (production only)
- `fuse.js` (search dependency)
- Vitest + Vue Test Utils (unit), Playwright (e2e)

## Steps Taken

`git log --oneline` (newest first):

- `8a1dbc5` fix(netlify): root `/` redirect to `/en/` (prefix strategy) + SPA fallback to `/200.html`
- `5d0410a` fix(netlify): node 24 + legacy-peer-deps (nuxt-security@2.6.0 needs >=24)
- `9ee9b6b` fix(i18n+security): detectBrowserLanguage:false, `$t`→`t`, missing keys, CSP nonce, lazy i18n, branded PWA
- `879e958` fix README.md formatting
- `b7d3112` convert README.txt to README.md with GitHub markdown formatting
- `1712360` add README.txt with deploy instructions + project overview
- `a9a218c` nuxt4 migration/creation + your-blog-nuxt4

## Pitfalls & Fixes

### Shared pitfalls (all shiro Nuxt 4 templates)

- **`nuxt-security@2.6.0` needs Node ≥ 24** — Netlify's default Node is too old and `npm install` fails (EBADENGINE). Fix: `NODE_VERSION = "24"` in `netlify.toml` `[build.environment]`.
- **esbuild peer conflict** — a peer dependency conflict (esbuild/rollup) aborts `npm install` with ERESOLVE. Fix: `npm install --legacy-peer-deps`.
- **i18n v10 `detectBrowserLanguage`** — must be `false`; browser detection causes unpredictable 302s on first load. Fix: `detectBrowserLanguage: false` and build links with `const localePath = useLocalePath()`.
- **`$t()` is banned in `<template>`** — i18n v10 drops the global `$t()` template helper. Fix: `const { t } = useI18n()` in `<script setup>` and call `t('key')`.
- **Component auto-import `pathPrefix: false`** — the default path-prefixed auto-import names don't match the tags, producing a blank screen with no console errors. Fix: declare each component dir with `pathPrefix: false`.
- **PWA `navigateFallback`** — a precached SPA fallback serves non-precached URLs as the app shell → blank screen. Fix: `navigateFallback: null` and exclude `.html` from precache globs (the Netlify SPA fallback targets `/200.html`).
- **i18n `prefix` strategy root redirect** — with `strategy: 'prefix'` there is no page at `/`. Netlify must 302 `/` → `/en/` (not a `/*` → `/index.html` SPA fallback, which loops).
- **`defineProps()` without `const props =`** — in `<script setup>` you must capture the return value (`const props = defineProps<...>()`); otherwise destructuring throws "props is not defined".
- **SSG vs SSR output dirs** — `nuxt build` (SSR) writes `.output/server` + `.output/public`; `nuxt generate` (SSG) writes the static site to `.output/public` only. Netlify `publish` must point at `.output/public`.

### Project-specific

- **Search is inline, not via Fuse** — `fuse.js` is listed in `dependencies`, but `app/pages/search.vue` actually filters posts inline with a `watchEffect` over title/excerpt/content/tags/category. `app/composables/useBlogSearch.ts` is a stub that exports `useBlogPosts()` and imports a non-existent `~/stores/blogPosts` store.
- **Duplicate i18n files** — locale JSON exists in both `i18n/locales/` and root `locales/`, and there are two config files (`i18n.config.ts` at root and `i18n/i18n.config.ts`). Keep translations in sync when editing.
- **`pathPrefix: false` on atoms + organisms only** — this template declares `atoms` and `organisms` (no `molecules` dir). Tag names must match the component file names exactly.

## Deployment

Static site generation:

```bash
npm install --legacy-peer-deps
npm run generate   # → .output/public
```

Netlify (`netlify.toml`): `NODE_VERSION = "24"`, build command `npm install --legacy-peer-deps --no-audit --no-fund && npm run generate`, publish dir `.output/public`, redirects `/` → `/en/` (302) and `/*` → `/200.html` (200, SPA fallback).

Live: https://your-blog-sh1r00-623.netlify.app

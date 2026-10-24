# DevBlog — Developer Blog
*shiro — where style meets function*

**Category: Blog Template**  
**Live:** [https://your-blog-sh1r00-623.netlify.app](https://your-blog-sh1r00-623.netlify.app)  
**GitHub:** [your-blog-nuxt4](https://github.com/sh1r00/your-blog-nuxt4)  

## About This Project

Technical developer blog with code syntax highlighting. Categories, tags, search, and RSS feed.

**Tech:** 
Nuxt 4, Vue 3, Nuxt Content, Tailwind CSS, Dark Mode, PWA, RSS

[![shiro](https://img.shields.io/badge/shiro-where_style_meets_function-6C5CE7)](https://shiro-portfolio-sh1r00.netlify.app)

## Deployment

```bash
npx nuxi generate
```bash
Deploy .output/public to Netlify via API zip upload.
```

## Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run generate
   ```

4. Preview production build:
   ```bash
   npx serve .output/public
   ```

## Notes

- Built with Nuxt 4 (compatibilityVersion 4) and Vue 3 Composition API
- All projects use atomic design: atoms/ → molecules/ → organisms/
- Dark mode is SSR-safe via Pinia store with useCookie() persistence
- PWA configured with service worker for offline access
- CSP headers configured via nuxt-security module (production only)
- i18n supports 3 locales: English, Español, አማርኛ

## Pitfalls & Fixes

- `nuxt-security@2.6.0` needs Node ≥ 24 → set `NODE_VERSION = "24"` in `netlify.toml`.
- Peer-dependency conflicts (esbuild) → install with `npm install --legacy-peer-deps`.
- i18n v10: keep `detectBrowserLanguage: false`; use `const { t } = useI18n()` (no `$t()` in templates).
- Component auto-import needs `pathPrefix: false` on each component dir, or sections render blank.
- PWA on SSG has no precached `index.html` → use `navigateFallback: null` and exclude `.html` from precache.
- i18n `prefix` strategy: Netlify needs `/` → `/en/` (302); a `/*` → `/index.html` fallback loops.
- SSG via `nuxt generate` → `.output/public` (not `nuxt build` → `.output/server`).
- Search is implemented inline in `app/pages/search.vue`; the `useBlogSearch` composable is a stub (imports a missing `~/stores/blogPosts`).

See [DOCUMENTATION.md](./DOCUMENTATION.md) for full details.

---

*Made with ❤️ by shiro — rasisg@gmail.com — github.com/sh1r00*

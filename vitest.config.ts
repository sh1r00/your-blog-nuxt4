import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import type { Plugin } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Nuxt auto-imports that need to be available in tests
const NUXT_AUTO_IMPORTS = [
  'ref', 'computed', 'watch', 'watchEffect',
  'useHead', 'useSeoMeta', 'useRuntimeConfig',
  'navigateTo', 'useRoute', 'useRouter',
  'useCookie', 'useI18n', 'useDarkMode', '$fetch',
]

function nuxtAutoImportPlugin(): Plugin {
  const SHIM_PATH = resolve(__dirname, 'tests/unit/auto-imports-shim.ts')
  // Use forward slashes and escape for safe import string
  const SHIM_IMPORT = JSON.stringify(SHIM_PATH.replace(/\\/g, '/'))
  return {
    name: 'nuxt-auto-imports',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return
      if (id.includes('auto-imports-shim')) return
      if (!id.includes('your-blog-nuxt4')) return

      // Find which auto-imports are used in this module but NOT already imported
      const used = NUXT_AUTO_IMPORTS.filter(name => {
        const re = new RegExp(`(?<![a-zA-Z_$])${name.replace('$', '\\$')}(?![a-zA-Z_$])`)
        // Skip if already imported from anywhere
        const alreadyImported = new RegExp(`import\\s+\\{[^}]*\\b${name.replace('$', '\\$')}\\b[^}]*\\}\\s+from`)
        return re.test(code) && !alreadyImported.test(code)
      })

      if (used.length === 0) return

      const importStmt = `\nimport { ${used.join(', ')} } from ${SHIM_IMPORT}\n`

      // Handle .vue SFC: inject into the <script setup> block
      if (id.endsWith('.vue')) {
        const scriptSetupMatch = code.match(/<script\s+setup[^>]*>/)
        if (scriptSetupMatch) {
          const tag = scriptSetupMatch[0]
          const idx = code.indexOf(tag) + tag.length
          return {
            code: code.slice(0, idx) + importStmt + code.slice(idx),
            map: null,
          }
        }
        return
      }

      // For regular .ts/.js files
      return {
        code: importStmt + code,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [nuxtAutoImportPlugin(), vue()],
  test: { environment: 'happy-dom', globals: true, include: ['tests/unit/**/*.spec.ts'], setupFiles: ['tests/unit/setup.ts'] },
  resolve: { alias: { '~': resolve(__dirname, 'app'), '@': resolve(__dirname, 'app') } },
})

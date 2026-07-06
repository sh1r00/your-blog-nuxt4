<template>
  <div class="fade-in">
    <div class="container-page py-12">
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-primary transition-colors mb-8">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
        {{ t('blog.backToBlog') }}
      </NuxtLink>
    </div>

    <div v-if="post" class="container-page pb-16">
      <div class="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">
        <!-- Main Content -->
        <article class="min-w-0">
          <!-- Header -->
          <header class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <span class="badge-primary">{{ post.category }}</span>
              <span class="text-sm text-[var(--color-text-secondary)]">{{ post.readTime }} {{ t('blog.minutesRead') }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              {{ post.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
                <span>{{ post.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]" aria-hidden="true">calendar_today</span>
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              </div>
            </div>
          </header>

          <!-- Content -->
          <div class="prose" v-html="renderedContent" />

          <!-- Tags -->
          <div class="mt-8 pt-6 border-t border-[var(--color-border)]">
            <h4 class="text-sm font-semibold mb-3">{{ t('blog.tags') }}</h4>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in post.tags"
                :key="tag"
                :to="`/tags/${tag}`"
                class="text-sm px-3 py-1 rounded-full bg-[var(--color-border)]/30 text-[var(--color-text-secondary)] hover:text-primary hover:bg-primary/10 transition-colors"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>
        </article>

        <!-- Sidebar -->
        <aside class="mt-10 lg:mt-0" aria-label="Sidebar">
          <div class="lg:sticky lg:top-24 space-y-6">
            <!-- Table of Contents -->
            <nav v-if="toc.length > 0" aria-label="Table of Contents">
              <h4 class="text-sm font-semibold mb-3 uppercase tracking-wider text-[var(--color-text-secondary)]">
                {{ t('blog.tableOfContents') }}
              </h4>
              <ul class="space-y-1">
                <li v-for="item in toc" :key="item.id">
                  <a
                    :href="`#${item.id}`"
                    class="block text-sm py-1 transition-colors hover:text-primary"
                    :class="item.level === 3 ? 'pl-4 text-[var(--color-text-secondary)]' : 'text-[var(--color-text)]'"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>

            <!-- Share -->
            <div>
              <h4 class="text-sm font-semibold mb-3 uppercase tracking-wider text-[var(--color-text-secondary)]">
                {{ t('blog.share') }}
              </h4>
              <div class="flex gap-2">
                <button
                  v-for="platform in shareLinks"
                  :key="platform.name"
                  class="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                  :aria-label="`Share on ${platform.name}`"
                  @click="platform.action"
                >
                  <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ platform.icon }}</span>
                </button>
              </div>
              <p v-if="copyFeedback" class="text-xs text-primary mt-2">{{ t('blog.linkCopied') }}</p>
            </div>
          </div>
        </aside>
      </div>

      <!-- Related Posts -->
      <section v-if="relatedPosts.length > 0" class="mt-16">
        <h3 class="text-2xl font-bold mb-6">{{ t('blog.relatedPosts') }}</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ABlogCard v-for="rp in relatedPosts" :key="rp.slug" :post="rp" />
        </div>
      </section>
    </div>

    <!-- 404 -->
    <div v-else class="container-page py-20 text-center">
      <h1 class="text-2xl font-bold mb-4">{{ t('errors.notFound') }}</h1>
      <p class="text-[var(--color-text-secondary)] mb-6">{{ t('errors.notFoundMessage') }}</p>
      <NuxtLink to="/" class="btn-primary">{{ t('blog.backToBlog') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPostBySlug, getRelatedPosts } from '~/data/blogPosts'

const { t } = useI18n()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const post = computed(() => getPostBySlug(slug.value))
const relatedPosts = computed(() => getRelatedPosts(slug.value, 3))

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch { return dateStr }
}

// TOC generation
const toc = computed(() => {
  if (!post.value) return []
  const headings = post.value.content.match(/^#{2,3}\s.+$/gm)
  if (!headings) return []
  return headings.map(h => {
    const level = h.startsWith('###') ? 3 : 2
    const text = h.replace(/^#{2,3}\s/, '')
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return { level, text, id }
  })
})

// Simple regex-based syntax highlighting for markdown code blocks
const renderedContent = computed(() => {
  if (!post.value) return ''

  let html = post.value.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Wrap code blocks
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) => {
      const langLabel = lang || 'code'
      const highlighted = highlightSyntax(code.trim(), lang)
      const escapedCode = highlighted
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
      return `
<div class="code-block-wrapper">
  <div class="code-block-header">
    <span class="lang-tag">${langLabel}</span>
    <button class="code-block-copy" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000)">Copy</button>
  </div>
  <pre><code class="language-${langLabel}">${escapedCode}</code></pre>
</div>`
    }
  )

  // Render markdown to HTML
  return renderMarkdown(html)
})

function highlightSyntax(code: string, lang: string): string {
  if (!code) return ''

  const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for',
    'while', 'class', 'extends', 'new', 'this', 'super', 'async', 'await', 'yield',
    'import', 'export', 'default', 'from', 'type', 'interface', 'enum', 'implements',
    'private', 'public', 'protected', 'static', 'readonly', 'abstract', 'as', 'is',
    'try', 'catch', 'throw', 'finally', 'switch', 'case', 'break', 'continue',
    'fn', 'mut', 'in', 'of', 'void', 'never', 'unknown', 'any', 'true', 'false',
    'null', 'undefined', 'struct', 'impl', 'pub', 'use', 'mod', 'self', 'match',
    'where', 'loop', 'move', 'ref']

  const types = ['string', 'number', 'boolean', 'Array', 'Promise', 'Map', 'Set',
    'String', 'Number', 'Object', 'Error', 'Result', 'Option', 'Vec', 'HashMap',
    'usize', 'u32', 'i32', 'u64', 'i64', 'f64', 'bool', 'char', 'str']

  let result = code

  // Comments
  result = result.replace(/(\/\/[^\n]*)/g, '<span class="hljs-comment">$1</span>')
  result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hljs-comment">$1</span>')

  // Strings (single, double, template)
  result = result.replace(/(`[^`]*`)/g, '<span class="hljs-string">$1</span>')
  result = result.replace(/("[^"]*")/g, '<span class="hljs-string">$1</span>')
  result = result.replace(/('[^']*')/g, '<span class="hljs-string">$1</span>')

  // Numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="hljs-number">$1</span>')

  // Keywords
  keywords.forEach(kw => {
    const re = new RegExp(`\\b(${kw})\\b`, 'g')
    result = result.replace(re, '<span class="hljs-keyword">$1</span>')
  })

  // Types
  types.forEach(t => {
    const re = new RegExp(`\\b(${t})\\b`, 'g')
    result = result.replace(re, '<span class="hljs-type">$1</span>')
  })

  // Functions (word followed by parentheses)
  result = result.replace(/\b([a-zA-Z_$][\w$]*)\s*\(/g, (_m: string, name: string) => {
    if (['if', 'for', 'while', 'switch', 'catch'].includes(name)) return _m
    return `<span class="hljs-function">${name}</span>(`
  })

  // Tags/JSX
  result = result.replace(/(<\/?[\w-]+)/g, '<span class="hljs-tag">$1</span>')
  result = result.replace(/\/>/g, '<span class="hljs-tag">/&gt;</span>')

  // Attributes
  result = result.replace(/\b([\w-]+)=/g, '<span class="hljs-attr">$1</span>=')

  // Arrow functions
  result = result.replace(/(=>)/g, '<span class="hljs-operator">$1</span>')

  return result
}

function renderMarkdown(text: string): string {
  let html = text

  // Headings with IDs
  html = html.replace(/^#### (.+)$/gm, (_m: string, h: string) => {
    const id = h.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h4 id="${id}">${h}</h4>`
  })
  html = html.replace(/^### (.+)$/gm, (_m: string, h: string) => {
    const id = h.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h3 id="${id}">${h}</h3>`
  })
  html = html.replace(/^## (.+)$/gm, (_m: string, h: string) => {
    const id = h.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h2 id="${id}">${h}</h2>`
  })
  html = html.replace(/^# (.+)$/gm, (_m: string, h: string) => {
    const id = h.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h1 id="${id}">${h}</h1>`
  })

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Inline code (not inside pre)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
  // Fix double ul wrapping
  html = html.replace(/<\/ul>\s*<ul>/g, '')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>')

  // Paragraphs (lines not already wrapped in tags)
  html = html.replace(/^(?!<[a-zA-Z/!])(.+)$/gm, '<p>$1</p>')

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')

  return html
}

// Share functionality
const copyFeedback = ref(false)
const currentUrl = computed(() => {
  if (import.meta.client) return window.location.href
  return ''
})

const shareLinks = computed(() => [
  {
    name: 'Twitter',
    icon: 'share',
    action: () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value?.title || '')}&url=${encodeURIComponent(currentUrl.value)}`, '_blank', 'noopener')
    },
  },
  {
    name: 'LinkedIn',
    icon: 'link',
    action: () => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl.value)}`, '_blank', 'noopener')
    },
  },
  {
    name: 'Copy Link',
    icon: 'content_copy',
    action: async () => {
      try {
        await navigator.clipboard.writeText(currentUrl.value)
        copyFeedback.value = true
        setTimeout(() => { copyFeedback.value = false }, 2000)
      } catch { /* ignore */ }
    },
  },
])

useHead(() => ({
  title: post.value?.title || 'Post not found',
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value?.title || '' },
    { property: 'og:description', content: post.value?.excerpt || '' },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: post.value?.date || '' },
    { property: 'article:author', content: post.value?.author || '' },
    { property: 'article:tag', content: post.value?.tags?.join(', ') || '' },
  ],
}))
</script>

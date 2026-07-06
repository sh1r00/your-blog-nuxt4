<template>
  <div class="fade-in">
    <!-- Hero Section -->
    <section class="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div class="container-page py-16 sm:py-20">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          {{ t('home.heroTitle') }}
        </h1>
        <p class="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-8">
          {{ t('home.heroSubtitle') }}
        </p>

        <!-- Search Bar (inline) -->
        <div class="max-w-lg">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-[20px]" aria-hidden="true">
              search
            </span>
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('home.searchPlaceholder')"
              class="input-field pl-10"
              @keydown.enter="navigateToSearch"
              @input="onSearchInput"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div
            v-if="searchQuery && searchResults.length > 0"
            class="absolute z-30 mt-2 w-full max-w-lg card shadow-xl max-h-64 overflow-y-auto"
          >
            <button
              v-for="result in searchResults"
              :key="result.slug"
              class="block w-full text-left px-4 py-3 hover:bg-[var(--color-surface-elevated)] transition-colors"
              @click="goToPost(result.slug)"
            >
              <p class="text-sm font-medium text-[var(--color-text)]">{{ result.title }}</p>
              <p class="text-xs text-[var(--color-text-secondary)] truncate">{{ result.excerpt }}</p>
            </button>
            <NuxtLink
              to="/search"
              class="block px-4 py-2 text-sm text-primary hover:bg-[var(--color-surface-elevated)] text-center"
            >
              {{ t('nav.search') }} "{{ searchQuery }}" →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    <section v-if="featuredPost" class="container-page py-10">
      <article class="card p-0 overflow-hidden">
        <div class="grid md:grid-cols-5">
          <div class="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
            <span class="badge-accent self-start mb-3">{{ t('home.featured') }}</span>
            <h2 class="text-2xl font-bold mb-3">
              <NuxtLink :to="`/blog/${featuredPost.slug}`" class="hover:text-primary transition-colors">
                {{ featuredPost.title }}
              </NuxtLink>
            </h2>
            <p class="text-[var(--color-text-secondary)] mb-4">
              {{ featuredPost.excerpt }}
            </p>
            <div class="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
              <span>{{ featuredPost.author }}</span>
              <span>{{ featuredPost.date }}</span>
              <span>{{ featuredPost.readTime }} {{ t('blog.minutesRead') }}</span>
            </div>
            <div class="mt-4">
              <NuxtLink :to="`/blog/${featuredPost.slug}`" class="btn-primary">
                {{ t('home.readMore') }}
                <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
              </NuxtLink>
            </div>
          </div>
          <div class="md:col-span-2 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-8 min-h-[200px]">
            <span class="material-symbols-outlined text-[80px] text-primary/40" aria-hidden="true">article</span>
          </div>
        </div>
      </article>
    </section>

    <!-- Filters & Posts -->
    <section class="container-page py-10">
      <!-- Category & Tag Filters -->
      <div class="flex flex-wrap items-center gap-3 mb-8">
        <button
          :class="['btn-secondary text-sm', { 'bg-primary text-white border-primary': !activeFilter.value }]"
          @click="clearFilters"
        >
          {{ t('home.allCategories') }}
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['btn-secondary text-sm', { 'bg-primary text-white border-primary': activeFilter.value === cat && activeFilter.type === 'category' }]"
          @click="setFilter('category', cat)"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flex flex-wrap gap-2 mb-8">
        <button
          :class="['text-xs px-3 py-1 rounded-full transition-colors', activeFilter.value === tag && activeFilter.type === 'tag' ? 'bg-primary text-white' : 'bg-[var(--color-border)]/30 text-[var(--color-text-secondary)] hover:text-primary']"
          v-for="tag in allTags"
          :key="tag"
          @click="setFilter('tag', tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Posts Grid -->
      <div v-if="filteredPosts.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ABlogCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
      </div>
      <p v-else class="text-center py-20 text-[var(--color-text-secondary)]">
        {{ t('home.noPosts') }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { blogPosts, getFeaturedPosts, getAllCategories, getAllTags } from '~/data/blogPosts'
import type { BlogPost } from '~/data/blogPosts'

const { t } = useI18n()
const router = useRouter()

const featuredPost = computed(() => getFeaturedPosts()[0] || null)
const categories = computed(() => getAllCategories())
const allTags = computed(() => getAllTags())

const activeFilter = ref<{ type: 'category' | 'tag'; value: string } | { type: ''; value: '' }>({ type: '', value: '' })

const filteredPosts = computed(() => {
  if (!activeFilter.value.type) return blogPosts
  if (activeFilter.value.type === 'category') {
    return blogPosts.filter(p => p.category.toLowerCase() === activeFilter.value.value.toLowerCase())
  }
  return blogPosts.filter(p => p.tags.some(t => t.toLowerCase() === activeFilter.value.value.toLowerCase()))
})

function setFilter(type: 'category' | 'tag', value: string) {
  activeFilter.value = { type, value }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  activeFilter.value = { type: '', value: '' }
}

// Inline search
const searchQuery = ref('')
const searchResults = ref<BlogPost[]>([])

function onSearchInput() {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  const q = searchQuery.value.toLowerCase()
  searchResults.value = blogPosts.filter(
    p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
  ).slice(0, 5)
}

function navigateToSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}

function goToPost(slug: string) {
  searchQuery.value = ''
  searchResults.value = []
  router.push(`/blog/${slug}`)
}

useHead({
  title: () => t('site.title'),
})
</script>

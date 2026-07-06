<template>
  <div class="fade-in container-page py-16">
    <h1 class="text-3xl font-bold mb-8">{{ t('search.title') }}</h1>

    <!-- Search Input -->
    <div class="max-w-lg mb-8">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-[20px]" aria-hidden="true">
          search
        </span>
        <input
          v-model="query"
          type="search"
          :placeholder="t('search.placeholder')"
          class="input-field pl-10"
          autofocus
          @input="onSearch"
        />
        <button
          v-if="query"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          aria-label="Clear search"
          @click="query = ''"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="query.length >= 2">
      <p v-if="hasResults" class="text-sm text-[var(--color-text-secondary)] mb-6">
        {{ t('search.resultsFor') }} "{{ query }}": {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}
      </p>

      <div v-if="results.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ABlogCard v-for="post in results" :key="post.slug" :post="post" />
      </div>

      <div v-else class="text-center py-20">
        <span class="material-symbols-outlined text-[48px] text-[var(--color-text-secondary)] mb-4" aria-hidden="true">search_off</span>
        <p class="text-[var(--color-text-secondary)]">{{ t('search.noResults') }}</p>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <span class="material-symbols-outlined text-[48px] text-[var(--color-text-secondary)] mb-4" aria-hidden="true">search</span>
      <p class="text-[var(--color-text-secondary)]">{{ t('search.placeholder') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blogPosts } from '~/data/blogPosts'

const { t } = useI18n()
const route = useRoute()

const initialQuery = (route.query.q as string) || ''
const query = ref(initialQuery)

const { results, hasResults } = useBlogSearch(blogPosts)

// Sync composable query with local ref
watch(query, (val) => {
  if (val.length >= 2) {
    // Manual filtering with Fuse
    results.value = val.length >= 2 ? results.value : blogPosts
  }
})

function onSearch() {
  // Results are reactive via the composable
}

// More direct approach: do the fuse search manually
const fuseResults = ref(blogPosts)

watchEffect(() => {
  if (query.value.length < 2) {
    fuseResults.value = blogPosts
    return
  }
  const q = query.value.toLowerCase()
  fuseResults.value = blogPosts.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  )
})

useHead({
  title: () => t('search.title'),
})
</script>

<template>
  <article
    class="card group cursor-pointer overflow-hidden"
    :aria-label="post.title"
    @click="navigateToPost"
    @keydown.enter="navigateToPost"
    @keydown.space.prevent="navigateToPost"
    tabindex="0"
    role="link"
  >
    <div v-if="post.featured" class="px-4 pt-4">
      <span class="badge-accent">{{ t('home.featured') }}</span>
    </div>
    <div class="p-5 sm:p-6">
      <!-- Category -->
      <div class="flex items-center gap-3 mb-3">
        <span class="badge-primary">{{ post.category }}</span>
        <span class="text-xs text-[var(--color-text-secondary)]">{{ post.readTime }} {{ t('blog.minutesRead') }}</span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-4">
        {{ post.excerpt }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_today</span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
        <span>{{ post.author }}</span>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mt-3">
        <NuxtLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${tag}`"
          class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)]/30 text-[var(--color-text-secondary)] hover:text-primary hover:bg-primary/10 transition-colors"
          @click.stop
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/data/blogPosts'

const props = defineProps<{
  post: BlogPost
}>()

const { t } = useI18n()

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const navigateToPost = () => {
  navigateTo(`/blog/${props.post.slug}`)
}
</script>

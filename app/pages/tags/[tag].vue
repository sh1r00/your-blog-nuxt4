<template>
  <div class="fade-in container-page py-16">
    <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-primary transition-colors mb-8">
      <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
      {{ t('blog.backToBlog') }}
    </NuxtLink>

    <template v-if="posts.length > 0">
      <h1 class="text-3xl font-bold mb-2">
        {{ t('tag.title') }}: #{{ tag }}
      </h1>
      <p class="text-[var(--color-text-secondary)] mb-8">
        {{ posts.length }} {{ posts.length === 1 ? 'post' : 'posts' }}
      </p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ABlogCard v-for="post in posts" :key="post.slug" :post="post" />
      </div>
    </template>

    <div v-else class="text-center py-20">
      <span class="material-symbols-outlined text-[48px] text-[var(--color-text-secondary)] mb-4" aria-hidden="true">sell</span>
      <h2 class="text-xl font-semibold mb-2">{{ t('tag.noPosts') }}</h2>
      <NuxtLink to="/" class="text-primary hover:underline">{{ t('blog.backToBlog') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPostsByTag } from '~/data/blogPosts'

const { t } = useI18n()
const route = useRoute()

const tag = computed(() => route.params.tag as string)
const posts = computed(() => getPostsByTag(tag.value))

useHead(() => ({
  title: `${t('tag.title')}: #${tag.value}`,
}))
</script>

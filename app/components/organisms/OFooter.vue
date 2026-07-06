<template>
  <footer
    class="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto"
    role="contentinfo"
  >
    <div class="container-page py-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary" aria-hidden="true">code</span>
            <span class="font-bold font-mono text-lg">DevBlog</span>
          </div>
          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {{ t('site.description') }}
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--color-text-secondary)]">
            {{ t('nav.categories') }}
          </h4>
          <ul class="space-y-2">
            <li v-for="cat in categories" :key="cat">
              <NuxtLink
                :to="`/categories/${cat.toLowerCase()}`"
                class="text-sm text-[var(--color-text-secondary)] hover:text-primary transition-colors"
              >
                {{ cat }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Tags -->
        <div>
          <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--color-text-secondary)]">
            {{ t('nav.tags') }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in popularTags"
              :key="tag"
              :to="`/tags/${tag}`"
              class="text-xs px-2 py-1 rounded-full bg-[var(--color-border)]/30 text-[var(--color-text-secondary)] hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {{ tag }}
            </NuxtLink>
          </div>
        </div>

        <!-- About -->
        <div>
          <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--color-text-secondary)]">
            {{ t('nav.about') }}
          </h4>
          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
            {{ t('about.intro') }}
          </p>
          <NuxtLink to="/about" class="text-sm text-primary hover:underline">
            {{ t('home.readMore') }} →
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-xs text-[var(--color-text-secondary)]">
          © {{ new Date().getFullYear() }} DevBlog. {{ t('footer.allRightsReserved') }}
        </p>
        <p class="text-xs text-[var(--color-text-secondary)]">
          {{ t('footer.builtWith') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { getAllCategories, getAllTags } from '~/data/blogPosts'

const { t } = useI18n()

const categories = computed(() => getAllCategories())
const popularTags = computed(() => getAllTags().slice(0, 8))
</script>

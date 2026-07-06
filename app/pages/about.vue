<template>
  <div class="fade-in container-page py-16">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
          <span class="material-symbols-outlined text-[48px] text-primary" aria-hidden="true">person</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">{{ t('about.title') }}</h1>
        <p class="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
          {{ t('about.intro') }}
        </p>
      </div>

      <!-- Bio -->
      <div class="card p-8 mb-8">
        <p class="text-[var(--color-text-secondary)] leading-relaxed">
          {{ t('about.bio') }}
        </p>
      </div>

      <!-- Tech Stack -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ t('about.techStack') }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="card p-4 flex flex-col items-center text-center gap-2"
          >
            <span class="material-symbols-outlined text-[32px] text-primary" aria-hidden="true">{{ tech.icon }}</span>
            <span class="text-sm font-medium">{{ tech.name }}</span>
            <span class="text-xs text-[var(--color-text-secondary)]">{{ tech.level }}</span>
          </div>
        </div>
      </div>

      <!-- Interests -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ t('about.interests') }}</h2>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="interest in interests"
            :key="interest"
            class="px-4 py-2 rounded-full bg-[var(--color-border)]/30 text-sm"
          >
            {{ interest }}
          </span>
        </div>
      </div>

      <!-- Socials -->
      <div>
        <h2 class="text-2xl font-bold mb-6">{{ t('about.socials') }}</h2>
        <div class="flex gap-4">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            class="p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors"
          >
            <span class="material-symbols-outlined text-[24px]" aria-hidden="true">{{ social.icon }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const techStack = [
  { name: 'Vue / Nuxt', icon: 'code', level: 'Expert' },
  { name: 'React / Next', icon: 'web', level: 'Advanced' },
  { name: 'TypeScript', icon: 'data_object', level: 'Expert' },
  { name: 'Node.js', icon: 'dns', level: 'Expert' },
  { name: 'Rust', icon: 'memory', level: 'Learning' },
  { name: 'PostgreSQL', icon: 'storage', level: 'Advanced' },
  { name: 'Docker', icon: 'deployed_code', level: 'Advanced' },
  { name: 'AWS / Cloud', icon: 'cloud', level: 'Advanced' },
]

const interests = [
  'Web Performance', 'Distributed Systems', 'Open Source',
  'Developer Tooling', 'System Design', 'Type Systems',
  'Accessibility', 'Security', 'UI/UX Design',
]

const socials = [
  { name: 'GitHub', icon: 'code', url: 'https://github.com' },
  { name: 'Twitter', icon: 'chat', url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: 'work', url: 'https://linkedin.com' },
  { name: 'Email', icon: 'mail', url: 'mailto:alex@devblog.example.com' },
]

useHead({
  title: () => t('about.title'),
})
</script>

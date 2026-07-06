<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="computedClass"
    v-bind="$attrs"
  >
    <span v-if="$slots.icon" class="material-symbols-outlined text-[20px]" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  ariaLabel?: string
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

const computedClass = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:brightness-110',
    secondary: 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]',
    ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>

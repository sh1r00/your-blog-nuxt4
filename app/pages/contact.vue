<template>
  <div class="fade-in container-page py-16">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">{{ t('contact.title') }}</h1>
        <p class="text-[var(--color-text-secondary)]">{{ t('contact.subtitle') }}</p>
      </div>

      <form
        class="card p-6 sm:p-8 space-y-5"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <!-- Name -->
        <div>
          <label for="contact-name" class="block text-sm font-medium mb-1.5">
            {{ t('contact.name') }}
            <span aria-hidden="true" class="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            v-model="form.name"
            type="text"
            :placeholder="t('contact.namePlaceholder')"
            class="input-field"
            required
            :aria-invalid="errors.name ? 'true' : undefined"
            @blur="validateField('name')"
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label for="contact-email" class="block text-sm font-medium mb-1.5">
            {{ formatEmail(t('contact.email')) }}
            <span aria-hidden="true" class="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            v-model="form.email"
            type="email"
            :placeholder="formatEmail(t('contact.emailPlaceholder'))"
            class="input-field"
            required
            :aria-invalid="errors.email ? 'true' : undefined"
            @blur="validateField('email')"
          />
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Subject -->
        <div>
          <label for="contact-subject" class="block text-sm font-medium mb-1.5">
            {{ t('contact.subject') }}
            <span aria-hidden="true" class="text-red-500">*</span>
          </label>
          <input
            id="contact-subject"
            v-model="form.subject"
            type="text"
            :placeholder="t('contact.subjectPlaceholder')"
            class="input-field"
            required
            :aria-invalid="errors.subject ? 'true' : undefined"
            @blur="validateField('subject')"
          />
          <p v-if="errors.subject" class="text-xs text-red-500 mt-1">{{ errors.subject }}</p>
        </div>

        <!-- Message -->
        <div>
          <label for="contact-message" class="block text-sm font-medium mb-1.5">
            {{ t('contact.message') }}
            <span aria-hidden="true" class="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            v-model="form.message"
            :placeholder="t('contact.messagePlaceholder')"
            class="text-area-field"
            rows="5"
            required
            :aria-invalid="errors.message ? 'true' : undefined"
            @blur="validateField('message')"
          />
          <p v-if="errors.message" class="text-xs text-red-500 mt-1">{{ errors.message }}</p>
        </div>

        <!-- Submit -->
        <div class="pt-2">
          <button
            type="submit"
            class="btn-primary w-full justify-center"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[18px]" aria-hidden="true">progress_activity</span>
            {{ isSubmitting ? '...' : t('contact.send') }}
          </button>
        </div>

        <!-- Success/Error Messages -->
        <div
          v-if="statusMessage"
          class="p-4 rounded-lg text-sm"
          :class="statusType === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'"
          role="alert"
        >
          {{ statusMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

function validateField(field: string) {
  errors[field] = ''
  if (field === 'name' && !form.name.trim()) {
    errors[field] = 'Name is required'
  }
  if (field === 'email') {
    if (!form.email.trim()) {
      errors[field] = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors[field] = 'Please enter a valid email'
    }
  }
  if (field === 'subject' && !form.subject.trim()) {
    errors[field] = 'Subject is required'
  }
  if (field === 'message' && !form.message.trim()) {
    errors[field] = 'Message is required'
  }
}

function validateForm(): boolean {
  const fields = ['name', 'email', 'subject', 'message'] as const
  fields.forEach(validateField)
  return Object.values(errors).every(e => !e)
}

async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true
  statusMessage.value = ''

  // Simulate submission (no API — just a client-side form)
  await new Promise(resolve => setTimeout(resolve, 1000))

  isSubmitting.value = false
  statusType.value = 'success'
  statusMessage.value = t('contact.success')

  // Reset form
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  Object.keys(errors).forEach(k => delete errors[k])

  setTimeout(() => { statusMessage.value = '' }, 4000)
}

useHead({
  title: () => t('contact.title'),
})
</script>

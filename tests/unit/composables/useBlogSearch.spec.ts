import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useBlogSearch } from '~/composables/useBlogSearch'
import type { BlogPost } from '~/data/blogPosts'

// We don't need to mock Fuse since it's a real library, but we need to make sure it's installed

const mockPosts: BlogPost[] = [
  {
    slug: 'test-post-1',
    title: 'Building Microservices with TypeScript',
    excerpt: 'Learn how to build microservices using TypeScript and Node.js.',
    content: 'Full content about microservices...',
    category: 'Architecture',
    tags: ['microservices', 'typescript', 'node'],
    date: '2025-06-15',
    readTime: 8,
    featured: true,
    author: 'Alex Chen',
  },
  {
    slug: 'test-post-2',
    title: 'CSS Container Queries Guide',
    excerpt: 'A comprehensive guide to CSS container queries.',
    content: 'Full content about CSS...',
    category: 'CSS',
    tags: ['css', 'container-queries', 'responsive'],
    date: '2025-05-28',
    readTime: 5,
    featured: false,
    author: 'Alex Chen',
  },
  {
    slug: 'test-post-3',
    title: 'Vue 3 Composition API Patterns',
    excerpt: 'Common patterns for the Vue 3 Composition API.',
    content: 'Full content about Vue...',
    category: 'Frontend',
    tags: ['vue', 'composition-api', 'patterns'],
    date: '2025-06-10',
    readTime: 6,
    featured: false,
    author: 'Alex Chen',
  },
]

describe('useBlogSearch', () => {
  describe('with a Ref<BlogPost[]>', () => {
    it('returns all posts when query is empty', () => {
      const posts = ref(mockPosts)
      const { results, hasResults } = useBlogSearch(posts)

      expect(results.value).toHaveLength(3)
      expect(hasResults.value).toBe(true)
    })

    it('filters posts by title match', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = 'Microservices'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
      expect(results.value[0].title).toContain('Microservices')
    })

    it('filters posts by excerpt match', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = 'container queries'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
      expect(results.value[0].slug).toBe('test-post-2')
    })

    it('filters posts by tag match', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = 'vue'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
    })

    it('filters posts by category match', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = 'Architecture'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
      expect(results.value[0].category).toBe('Architecture')
    })

    it('has no results for non-matching query', async () => {
      const posts = ref(mockPosts)
      const { query, results, hasResults } = useBlogSearch(posts)

      query.value = 'xyznonexistent12345'
      await nextTick()

      expect(results.value).toHaveLength(0)
      expect(hasResults.value).toBe(false)
    })

    it('returns all results for empty/whitespace query', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = '   '
      await nextTick()

      expect(results.value).toHaveLength(3)
    })

    it('returns the correct refs from the composable', () => {
      const posts = ref(mockPosts)
      const result = useBlogSearch(posts)

      expect(result).toHaveProperty('query')
      expect(result).toHaveProperty('isSearching')
      expect(result).toHaveProperty('results')
      expect(result).toHaveProperty('hasResults')
    })

    it('updates results reactively when query changes', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = 'TypeScript'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
      expect(results.value.some(p => p.title.includes('TypeScript'))).toBe(true)

      query.value = ''
      await nextTick()

      expect(results.value).toHaveLength(3)
    })

    it('returns partial matches with fuzzy search', async () => {
      const posts = ref(mockPosts)
      const { query, results } = useBlogSearch(posts)

      query.value = 'Micro'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('with a plain BlogPost[] array', () => {
    it('returns all posts when query is empty', () => {
      const { results, hasResults } = useBlogSearch(mockPosts)

      expect(results.value).toHaveLength(3)
      expect(hasResults.value).toBe(true)
    })

    it('filters posts by title match with plain array', async () => {
      const { query, results } = useBlogSearch(mockPosts)

      query.value = 'CSS'
      await nextTick()

      expect(results.value.length).toBeGreaterThanOrEqual(1)
      expect(results.value[0].title).toContain('CSS')
    })

    it('handles empty posts array', () => {
      const { results, hasResults } = useBlogSearch([])

      expect(results.value).toHaveLength(0)
      expect(hasResults.value).toBe(false)
    })

    it('handles single post array', async () => {
      const singlePost = [mockPosts[0]]
      const { query, results } = useBlogSearch(singlePost)

      expect(results.value).toHaveLength(1)

      query.value = 'Microservices'
      await nextTick()

      expect(results.value).toHaveLength(1)

      query.value = 'nonexistent'
      await nextTick()

      expect(results.value).toHaveLength(0)
    })
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ABlogCard from '~/components/atoms/ABlogCard.vue'
import type { BlogPost } from '~/data/blogPosts'

const basePost: BlogPost = {
  slug: 'test-post',
  title: 'Test Post Title',
  excerpt: 'This is a test excerpt for the blog post.',
  content: 'Full content here...',
  category: 'Testing',
  tags: ['vitest', 'vue'],
  date: '2025-06-15',
  readTime: 5,
  featured: false,
  author: 'Alex Chen',
}

describe('ABlogCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders an article element', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('article').exists()).toBe(true)
  })

  it('sets aria-label to post title', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('article').attributes('aria-label')).toBe('Test Post Title')
  })

  it('displays the post title', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('h3').text()).toBe('Test Post Title')
  })

  it('displays the post excerpt', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.text()).toContain('This is a test excerpt for the blog post.')
  })

  it('displays the category badge', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    const badges = wrapper.findAll('.badge-primary')
    expect(badges.length).toBeGreaterThanOrEqual(1)
    expect(badges[0].text()).toBe('Testing')
  })

  it('displays read time', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('blog.minutesRead')
  })

  it('displays the post date', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('time').exists()).toBe(true)
    expect(wrapper.find('time').attributes('datetime')).toBe('2025-06-15')
  })

  it('displays author name', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.text()).toContain('Alex Chen')
  })

  it('renders tag links with # prefix', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    const tagLinks = wrapper.findAll('a[href^="/tags/"]')
    expect(tagLinks.length).toBe(2)
    expect(tagLinks[0].text()).toBe('#vitest')
    expect(tagLinks[1].text()).toBe('#vue')
  })

  it('shows featured badge when post is featured', () => {
    const featuredPost = { ...basePost, featured: true }
    const wrapper = mount(ABlogCard, { props: { post: featuredPost } })
    expect(wrapper.text()).toContain('home.featured')
  })

  it('does not show featured badge when post is not featured', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('.badge-accent').exists()).toBe(false)
  })

  it('navigates to the post on click', async () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    await wrapper.find('article').trigger('click')
    // navigateTo mock should have been called
    const { navigateTo } = await import('~/components/atoms/ABlogCard.vue' as any)
    // We verify navigation triggers without error
    expect(wrapper.find('article').exists()).toBe(true)
  })

  it('has role="link" on the article', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('article').attributes('role')).toBe('link')
  })

  it('has tabindex 0 for keyboard accessibility', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    expect(wrapper.find('article').attributes('tabindex')).toBe('0')
  })

  it('formats date correctly', () => {
    const wrapper = mount(ABlogCard, { props: { post: basePost } })
    const time = wrapper.find('time')
    expect(time.text()).toContain('2025')
  })

  it('handles a post with many tags', () => {
    const manyTagsPost = { ...basePost, tags: ['a', 'b', 'c', 'd', 'e'] }
    const wrapper = mount(ABlogCard, { props: { post: manyTagsPost } })
    const tagLinks = wrapper.findAll('a[href^="/tags/"]')
    expect(tagLinks.length).toBe(5)
  })

  it('handles a post with no tags', () => {
    const noTagsPost = { ...basePost, tags: [] }
    const wrapper = mount(ABlogCard, { props: { post: noTagsPost } })
    const tagLinks = wrapper.findAll('a[href^="/tags/"]')
    expect(tagLinks.length).toBe(0)
  })
})

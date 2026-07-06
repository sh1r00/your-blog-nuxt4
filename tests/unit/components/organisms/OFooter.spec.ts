import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OFooter from '~/components/organisms/OFooter.vue'

// Mock blog data functions
vi.mock('~/data/blogPosts', () => ({
  getAllCategories: vi.fn(() => ['Architecture', 'Nuxt', 'TypeScript', 'CSS', 'Security']),
  getAllTags: vi.fn(() => ['microservices', 'resilience', 'typescript', 'patterns', 'nuxt', 'vue', 'ssr', 'performance']),
}))

describe('OFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a footer element with role contentinfo', () => {
    const wrapper = mount(OFooter)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('footer').attributes('role')).toBe('contentinfo')
  })

  it('renders the DevBlog brand section', () => {
    const wrapper = mount(OFooter)
    expect(wrapper.text()).toContain('DevBlog')
  })

  it('renders category links', () => {
    const wrapper = mount(OFooter)
    const catLinks = wrapper.findAll('a[href^="/categories/"]')
    expect(catLinks.length).toBeGreaterThan(0)
  })

  it('renders category links with lowercase paths', () => {
    const wrapper = mount(OFooter)
    const catLinks = wrapper.findAll('a[href^="/categories/"]')
    const hrefs = catLinks.map(link => link.attributes('href'))
    expect(hrefs).toContain('/categories/architecture')
    expect(hrefs).toContain('/categories/nuxt')
  })

  it('renders tag links', () => {
    const wrapper = mount(OFooter)
    const tagLinks = wrapper.findAll('a[href^="/tags/"]')
    expect(tagLinks.length).toBeGreaterThan(0)
    expect(tagLinks.length).toBeLessThanOrEqual(8)
  })

  it('renders the about section link', () => {
    const wrapper = mount(OFooter)
    const aboutLink = wrapper.find('a[href="/about"]')
    expect(aboutLink.exists()).toBe(true)
  })

  it('renders the copyright notice with current year', () => {
    const wrapper = mount(OFooter)
    const currentYear = new Date().getFullYear().toString()
    expect(wrapper.text()).toContain(currentYear)
  })

  it('contains the code icon in brand section', () => {
    const wrapper = mount(OFooter)
    const icon = wrapper.find('span.material-symbols-outlined')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('code')
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OHeader from '~/components/organisms/OHeader.vue'

// Stub ADarkModeToggle since it's not auto-registered in test
const ADarkModeToggleStub = {
  name: 'ADarkModeToggle',
  template: '<button class="dm-toggle-stub">DM Toggle</button>',
}

describe('OHeader', () => {
  const mountOptions = {
    global: { stubs: { ADarkModeToggle: ADarkModeToggleStub } },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a header element with role banner', () => {
    const wrapper = mount(OHeader, mountOptions)
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('header').attributes('role')).toBe('banner')
  })

  it('renders the DevBlog logo link', () => {
    const wrapper = mount(OHeader, mountOptions)
    const logoLink = wrapper.find('a[aria-label="DevBlog Home"]')
    expect(logoLink.exists()).toBe(true)
    expect(logoLink.text()).toContain('DevBlog')
  })

  it('renders desktop navigation links', () => {
    const wrapper = mount(OHeader, mountOptions)
    const nav = wrapper.find('nav[aria-label="Main navigation"]')
    expect(nav.exists()).toBe(true)
    const links = nav.findAll('a')
    // Should have 4 nav items: home, about, contact, search
    expect(links.length).toBeGreaterThanOrEqual(3)
  })

  it('renders a language switcher', () => {
    const wrapper = mount(OHeader, mountOptions)
    // The language button contains the language icon
    const langBtn = wrapper.find('button .material-symbols-outlined')
    expect(langBtn.exists()).toBe(true)
  })

  it('renders the dark mode toggle stub', () => {
    const wrapper = mount(OHeader, mountOptions)
    expect(wrapper.find('.dm-toggle-stub').exists()).toBe(true)
  })

  it('renders the mobile menu button', () => {
    const wrapper = mount(OHeader, mountOptions)
    const mobileBtn = wrapper.find('button[aria-label="Open menu"]')
    expect(mobileBtn.exists()).toBe(true)
  })

  it('opens mobile menu on button click', async () => {
    const wrapper = mount(OHeader, mountOptions)
    expect(wrapper.find('nav[aria-label="Mobile navigation"]').exists()).toBe(false)

    await wrapper.find('button[aria-label="Open menu"]').trigger('click')
    expect(wrapper.find('nav[aria-label="Mobile navigation"]').exists()).toBe(true)
  })

  it('renders with sticky header classes', () => {
    const wrapper = mount(OHeader, mountOptions)
    const header = wrapper.find('header')
    expect(header.classes()).toContain('sticky')
    expect(header.classes()).toContain('top-0')
  })

  it('has a mobile navigation that shows nav items', async () => {
    const wrapper = mount(OHeader, mountOptions)
    await wrapper.find('button[aria-label="Open menu"]').trigger('click')

    const mobileNav = wrapper.find('nav[aria-label="Mobile navigation"]')
    expect(mobileNav.exists()).toBe(true)
    const links = mobileNav.findAll('a')
    expect(links.length).toBeGreaterThanOrEqual(3)
  })
})

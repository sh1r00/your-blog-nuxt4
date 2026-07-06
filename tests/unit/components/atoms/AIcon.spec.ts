import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AIcon from '~/components/atoms/AIcon.vue'

describe('AIcon', () => {
  it('renders a span with material-symbols-outlined class', () => {
    const wrapper = mount(AIcon, { props: { name: 'home' } })
    const span = wrapper.find('span')
    expect(span.exists()).toBe(true)
    expect(span.classes()).toContain('material-symbols-outlined')
  })

  it('renders the icon name as text content', () => {
    const wrapper = mount(AIcon, { props: { name: 'settings' } })
    expect(wrapper.text()).toBe('settings')
  })

  it('sets aria-hidden to true', () => {
    const wrapper = mount(AIcon, { props: { name: 'search' } })
    expect(wrapper.find('span').attributes('aria-hidden')).toBe('true')
  })

  it('applies default size "md" class', () => {
    const wrapper = mount(AIcon, { props: { name: 'star' } })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('text-[20px]')
  })

  it('applies size sm class', () => {
    const wrapper = mount(AIcon, { props: { name: 'star', size: 'sm' } })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('text-[16px]')
  })

  it('applies size lg class', () => {
    const wrapper = mount(AIcon, { props: { name: 'star', size: 'lg' } })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('text-[28px]')
  })

  it('applies size xl class', () => {
    const wrapper = mount(AIcon, { props: { name: 'star', size: 'xl' } })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('text-[36px]')
  })

  it('has the select-none class', () => {
    const wrapper = mount(AIcon, { props: { name: 'home' } })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('select-none')
  })

  it('passes $attrs to the span', () => {
    const wrapper = mount(AIcon, {
      props: { name: 'close' },
      attrs: { 'data-testid': 'icon-close' },
    })
    expect(wrapper.find('span').attributes('data-testid')).toBe('icon-close')
  })
})

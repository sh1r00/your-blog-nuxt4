import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ABaseButton from '~/components/atoms/ABaseButton.vue'

describe('ABaseButton', () => {
  it('renders a button element', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'Click me' } })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toBe('Click me')
  })

  it('renders default type as "button"', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'OK' } })
    expect(wrapper.find('button').attributes('type')).toBe('button')
  })

  it('renders type="submit" when type prop is submit', () => {
    const wrapper = mount(ABaseButton, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('renders type="reset" when type prop is reset', () => {
    const wrapper = mount(ABaseButton, {
      props: { type: 'reset' },
      slots: { default: 'Reset' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('reset')
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'Primary' } })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('bg-primary')
  })

  it('applies secondary variant classes', () => {
    const wrapper = mount(ABaseButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Secondary' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('border')
  })

  it('applies ghost variant classes', () => {
    const wrapper = mount(ABaseButton, {
      props: { variant: 'ghost' },
      slots: { default: 'Ghost' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('text-[var(--color-text-secondary)]')
  })

  it('applies size md classes by default', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'Medium' } })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('px-5')
    expect(button.attributes('class')).toContain('py-2.5')
  })

  it('applies size sm classes', () => {
    const wrapper = mount(ABaseButton, {
      props: { size: 'sm' },
      slots: { default: 'Small' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('px-3')
  })

  it('applies size lg classes', () => {
    const wrapper = mount(ABaseButton, {
      props: { size: 'lg' },
      slots: { default: 'Large' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('px-6')
  })

  it('is not disabled by default', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'Enabled' } })
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(ABaseButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })
    expect(wrapper.find('button').element.disabled).toBe(true)
  })

  it('applies disabled classes when disabled', () => {
    const wrapper = mount(ABaseButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('disabled:opacity-50')
  })

  it('sets aria-label when provided', () => {
    const wrapper = mount(ABaseButton, {
      props: { ariaLabel: 'Close dialog' },
      slots: { default: 'X' },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Close dialog')
  })

  it('renders icon slot when provided', () => {
    const wrapper = mount(ABaseButton, {
      slots: {
        icon: 'star',
        default: 'Favorite',
      },
    })
    const iconSpan = wrapper.find('span.material-symbols-outlined')
    expect(iconSpan.exists()).toBe(true)
    expect(iconSpan.text()).toBe('star')
    expect(iconSpan.attributes('aria-hidden')).toBe('true')
  })

  it('does not render icon span when icon slot is not provided', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'No Icon' } })
    expect(wrapper.find('span.material-symbols-outlined').exists()).toBe(false)
  })

  it('passes $attrs to the button element', () => {
    const wrapper = mount(ABaseButton, {
      attrs: { 'data-testid': 'my-button', 'class': 'extra-class' },
      slots: { default: 'With attrs' },
    })
    const button = wrapper.find('button')
    expect(button.attributes('data-testid')).toBe('my-button')
  })

  it('includes base classes for inline-flex and rounded', () => {
    const wrapper = mount(ABaseButton, { slots: { default: 'Base' } })
    const button = wrapper.find('button')
    expect(button.attributes('class')).toContain('inline-flex')
    expect(button.attributes('class')).toContain('rounded-lg')
  })
})

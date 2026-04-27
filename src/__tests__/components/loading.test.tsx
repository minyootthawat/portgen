import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Loading from '@/app/builder/[id]/loading'

describe('loading.tsx', () => {
  it('renders non-empty DOM', () => {
    const { container } = render(<Loading />)
    expect(container).not.toBeEmptyDOMElement()
  })

  it('renders inside a full-height flex container', () => {
    const { container } = render(<Loading />)
    const root = container.firstElementChild
    expect(root?.className).toMatch(/min-h-screen/)
    expect(root?.className).toMatch(/flex/)
  })

  it('renders skeleton loading elements', () => {
    const { container } = render(<Loading />)
    const skeletons = container.querySelectorAll('[class*="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders loading text', () => {
    const { container } = render(<Loading />)
    const text = container.textContent
    expect(text).toMatch(/Loading|loading|กำลัง/)
  })
})

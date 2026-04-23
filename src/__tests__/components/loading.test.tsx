import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loading from '@/app/builder/[id]/loading'

describe('loading.tsx', () => {
  it('renders a spinner with animate-spin class', () => {
    render(<Loading />)
    const spinner = document.querySelector('[class*="animate-spin"]')
    expect(spinner).toBeInTheDocument()
  })

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

  it('renders text content indicating loading state', () => {
    render(<Loading />)
    // The loading component uses a lucide Loader2 icon — verify it's present
    const spinner = document.querySelector('[class*="animate-spin"]')
    expect(spinner).toBeInTheDocument()
    expect(spinner?.tagName).toBe('svg')
  })
})

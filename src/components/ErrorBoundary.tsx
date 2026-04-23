'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetRef?: React.RefObject<{ reset: () => void } | null>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Catches JavaScript errors in child components.
 * Renders the `fallback` prop when an error is caught.
 * Call `reset()` via the resetRef to clear the error state.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  reset(): void {
    this.setState({ hasError: false, error: null })
  }

  componentDidMount(): void {
    if (this.props.resetRef) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.props.resetRef as React.MutableRefObject<any>).current = { reset: () => this.reset() }
    }
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

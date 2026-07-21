import React, { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children:  ReactNode
  fallback?: ReactNode
}

interface State {
  hasError:  boolean
  error:     Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Global ErrorBoundary
 * Catches React render errors and shows a premium error UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ errorInfo: info })
    // TODO: send to error reporting service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center p-6"
          style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-danger-light dark:bg-danger-dark/20
                              flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>
                Something went wrong
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-body)' }}>
                An unexpected error occurred. Our team has been notified.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <pre className="mt-4 p-4 rounded-xl text-xs text-left overflow-auto
                               bg-danger-light dark:bg-danger-dark/10 text-danger-dark dark:text-red-300
                               max-h-40 border border-danger/20">
                  {this.state.error.message}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                           bg-primary text-white text-sm font-medium
                           hover:bg-primary-hover transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                           border text-sm font-medium transition-colors"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-body)' }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

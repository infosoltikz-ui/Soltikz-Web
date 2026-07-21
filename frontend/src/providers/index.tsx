import { ThemeProvider }  from './ThemeProvider'
import { QueryProvider }  from './QueryProvider'
import { ErrorBoundary }  from './ErrorBoundary'
import { AuthProvider } from './AuthProvider'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}

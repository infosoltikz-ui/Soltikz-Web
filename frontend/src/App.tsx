import { AppProviders } from '@providers'
import { AppRouter }    from '@routes'

/**
 * Root App component.
 * Providers wrap the router — clean composition pattern.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

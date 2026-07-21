import { Outlet } from 'react-router-dom'
import { Header } from '@components/navigation/Header'
import { Footer } from '@components/navigation/Footer'
import { ToastContainer } from '@components/ui/Overlay'

/**
 * PublicLayout — wraps all public-facing pages
 * Header + main content + Footer
 */
export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-dvh" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

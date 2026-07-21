import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'

const root = document.getElementById('root')

if (!root) {
  throw new Error('[main] #root element not found in document. Check index.html.')
}

createRoot(root).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

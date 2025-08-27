import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { initializeCSSColors } from './theme/colorSync'
import App from './App.tsx'

// Initialize CSS color system
initializeCSSColors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

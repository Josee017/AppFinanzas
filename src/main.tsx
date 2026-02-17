import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// DEBUG TRACE
console.log('Main Entry Point Executing');

import './index.css'
import './lib/i18n'
import App from './App.tsx'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

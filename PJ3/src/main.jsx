import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🚀 main.jsx loaded - Starting React app... TIME:', new Date().toLocaleTimeString());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('✅ React app rendered at:', new Date().toLocaleTimeString());

/**
 * React Application Entry Point
 *
 * This is the very first file that runs.
 * It renders our App component into the HTML page.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing (page navigation without reload) */}
    <BrowserRouter>
      {/* AuthProvider makes auth state available to ALL components */}
      <AuthProvider>
        <App />
        {/* Toast notifications (success/error popups) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#f3f4f6' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f3f4f6' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

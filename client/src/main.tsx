import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './providers/AuthProvider';
import App from './app/App'
import './index.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
   <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>

)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './AuthContext'
import AuthenticatedComponent from './AuthenticatedComponent'
import App from './components/app/App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <AuthenticatedComponent>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthenticatedComponent>
  </AuthProvider>
)

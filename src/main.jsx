import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { CommunityProvider } from './context/CommunityContext'
import { ReportProvider } from './context/ReportContext'
import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <CommunityProvider>
          <ReportProvider>
            <App />
          </ReportProvider>
        </CommunityProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)

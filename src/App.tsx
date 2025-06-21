import { Sidebar } from './components/Sidebar/Sidebar'
import { Header } from './components/Header/Header'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { TourGuide } from './components/Tour/TourGuide'
import AppRoutes from './components/AppRoutes/AppRoutes'
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary'
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCustomerPage = location.pathname.startsWith('/customer')
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      
      // Redirect to transactions page on mobile if not on auth or customer pages
      if (mobile && !isCustomerPage && !isAuthPage && location.pathname !== '/transactions') {
        navigate('/transactions')
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isCustomerPage, isAuthPage, location.pathname, navigate])

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <TourGuide>
          <div className={`appContainer ${isMobile ? 'mobile' : ''}`}>
            {!isCustomerPage && !isAuthPage && !isMobile && (
              <>
                <Sidebar />
                <Header />
              </>
            )}
            {!isCustomerPage && !isAuthPage && isMobile && (
              <MobileHeader />
            )}
            <div className={`main ${isMobile ? 'mobile-main' : ''}`}>
              <main className={`content ${isMobile ? 'mobile-content' : ''}`}>
                <AppRoutes />
              </main>
            </div>
          </div>
        </TourGuide>
      </ErrorBoundary>
    </LanguageProvider>
  )
}

// Mobile Header Component
const MobileHeader = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isAuth')
    navigate('/signin')
  }

  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        <div className="mobile-brand">
          <p>Finance<span>Hub</span></p>
        </div>
        <div className="mobile-user-info">
          <span>{user?.username || t('common', 'user')}</span>
          <button onClick={handleLogout} className="mobile-logout">
            {t('navigation', 'logout')}
          </button>
        </div>
      </div>
    </header>
  )
}

export default App

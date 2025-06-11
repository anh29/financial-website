import { Sidebar } from './components/Sidebar/Sidebar'
import { Header } from './components/Header/Header'
import { LanguageProvider } from './context/LanguageContext'
import { TourGuide } from './components/Tour/TourGuide'
import AppRoutes from './components/AppRoutes/AppRoutes'
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary'
import './App.css'
import { useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const isCustomerPage = location.pathname.startsWith('/customer')
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname)

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <TourGuide>
          <div className='appContainer'>
            {!isCustomerPage && !isAuthPage && (
              <>
                <Sidebar />
                <Header />
              </>
            )}
            <div className='main'>
              <main className='content'>
                <AppRoutes />
              </main>
            </div>
          </div>
        </TourGuide>
      </ErrorBoundary>
    </LanguageProvider>
  )
}

export default App

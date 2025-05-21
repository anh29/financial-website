import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import AppRoutes from './components/AppRoutes/AppRoutes'
import { LoadingSpinner } from './components/common'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { isLoading } = useAuth()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const isIndividualPage = () =>
    ['/signin', '/signup'].includes(location.pathname) || location.pathname.startsWith('/customer')

  const renderSidebarToggle = () => (
    <button className='sidebar-toggle' onClick={toggleSidebar} aria-label='Toggle sidebar'>
      ☰
    </button>
  )

  const renderMainContent = () => (
    <div className={`main-content ${isIndividualPage() ? 'full-screen' : ''}`}>
      {!isIndividualPage() && <Header />}
      <div
        className={`${isIndividualPage() ? 'individual-page' : 'content scroll'}`}
        onClick={() => setSidebarOpen(false)}
      >
        {isLoading ? (
          <div className='loading-container'>
            <LoadingSpinner />
          </div>
        ) : (
          <AppRoutes />
        )}
      </div>
    </div>
  )

  return (
    <div className='appContainer'>
      {!isIndividualPage() && (
        <>
          {renderSidebarToggle()}
          <Sidebar className={sidebarOpen ? 'open' : ''} />
        </>
      )}
      {renderMainContent()}
    </div>
  )
}

export default App

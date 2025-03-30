import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import AppRoutes from './components/AppRoutes/AppRoutes'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const isLoginPage = () => ['/signin', '/signup'].includes(location.pathname)

  const renderSidebarToggle = () => (
    <button className='sidebar-toggle' onClick={toggleSidebar}>
      ☰
    </button>
  )

  return (
    <div className='app-container'>
      {!isLoginPage() && (
        <>
          {renderSidebarToggle()}
          <Sidebar className={sidebarOpen ? 'open' : ''} />
        </>
      )}
      <div className={`main-content ${isLoginPage() ? 'full-screen' : ''}`}>
        {!isLoginPage() && <Header />}
        <div className='content' onClick={() => setSidebarOpen(false)}>
          <AppRoutes />
        </div>
      </div>
    </div>
  )
}

export default App

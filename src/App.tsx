import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import BudgetSuggestionsPage from './pages/BudgetSuggestionsPage/BudgetSuggestionsPage'
import FinancialAdvicePage from './pages/FinancialAdvicePage/FinancialAdvicePage'
import FinancialStatementsPage from './pages/FinancialStatementsPage/FinancialStatementsPage'
import IncomeExpensePage from './pages/IncomeExpensePage/IncomeExpensePage'
import HomePage from './pages/HomePage/HomePage'
import SignupPage from './pages/SignupPage/SignupPage'
import SignInPage from './pages/SignInPage/SignInPage'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const isLoginPage = location.pathname === '/signin' || location.pathname === '/signup'

  return (
    <div className='app-container'>
      {!isLoginPage && (
        <>
          <button className='sidebar-toggle' onClick={toggleSidebar}>
            ☰
          </button>
          <Sidebar className={sidebarOpen ? 'open' : ''} />
        </>
      )}
      <div className={`main-content ${isLoginPage ? 'full-screen' : ''}`}>
        {!isLoginPage && <Header />}
        <div className='content' onClick={() => setSidebarOpen(false)}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/income-expense' element={<IncomeExpensePage />} />
            <Route path='/financial-statements' element={<FinancialStatementsPage />} />
            <Route path='/budget-suggestions' element={<BudgetSuggestionsPage />} />
            <Route path='/financial-advice' element={<FinancialAdvicePage />} />
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/signup' element={<SignupPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App

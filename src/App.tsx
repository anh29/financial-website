import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import BudgetSuggestionsPage from './pages/BudgetSuggestionsPage/BudgetSuggestionsPage'
import FinancialAdvicePage from './pages/FinancialAdvicePage/FinancialAdvicePage'
import FinancialStatementsPage from './pages/FinancialStatementsPage/FinancialStatementsPage'
import IncomeExpensePage from './pages/IncomeExpensePage/IncomeExpensePage'
import HomePage from './pages/HomePage/HomePage'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className='app-container'>
      <button className='sidebar-toggle' onClick={toggleSidebar}>
        ☰
      </button>
      <Sidebar className={sidebarOpen ? 'open' : ''} />
      <div className='main-content'>
        <Header />
        <div className='content' onClick={() => setSidebarOpen(false)}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/income-expense' element={<IncomeExpensePage />} />
            <Route path='/financial-statements' element={<FinancialStatementsPage />} />
            <Route path='/budget-suggestions' element={<BudgetSuggestionsPage />} />
            <Route path='/financial-advice' element={<FinancialAdvicePage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App

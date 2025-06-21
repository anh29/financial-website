import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import HomePage from '../../pages/HomePage/HomePage'
import SignInPage from '../../pages/SignInPage/SignInPage'
import TransactionPage from '../../pages/TransactionPage/TransactionPage'
import UpcomingPage from '../../pages/UpcomingPage/UpcomingPage'
import ExpensesPage from '../../pages/ExpensesPage/ExpensesPage'
import SettingsPage from '../../pages/SettingsPage/SettingsPage'
import BudgetPage from '../../pages/BudgetPage/BudgetPage'
import { CustomerLayout } from '../CustomerComponents/CustomerLayout/CustomerLayout'
import CustomerPage from '../../pages/CustomerPage/CustomerPage'
import GoalPage from '../../pages/GoalPage/GoalPage'
import BlogPage from '../CustomerComponents/BlogSection/BlogPage'
import SupportPage from '../CustomerComponents/SupportSection/SupportPage'
import SignUpPage from '../../pages/SignUpPage/SignUpPage'
import { BlogDetail } from '../CustomerComponents/BlogSection/BlogDetail/BlogDetail'

const AppRoutes: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Check if we're on mobile and redirect to transactions if needed
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const isCustomerPage = location.pathname.startsWith('/customer')
    const isAuthPage = ['/signin', '/signup'].includes(location.pathname)
    const isTransactionsPage = location.pathname === '/transactions'
    
    if (isMobile && !isCustomerPage && !isAuthPage && !isTransactionsPage) {
      navigate('/transactions')
    }
  }, [location.pathname, navigate])

  return (
    <Routes>
      <Route
        path='/customer'
        element={
          <CustomerLayout>
            <CustomerPage />
          </CustomerLayout>
        }
      >
        <Route path='blog' element={<BlogPage />} />
        <Route path='blog/:id' element={<BlogDetail />} />
        <Route path='support' element={<SupportPage />} />
      </Route>
      <Route
        path='/'
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path='/transactions'
        element={
          <PrivateRoute>
            <TransactionPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/bills'
        element={
          <PrivateRoute>
            <UpcomingPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/expenses'
        element={
          <PrivateRoute>
            <ExpensesPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/goals'
        element={
          <PrivateRoute>
            <GoalPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/budget'
        element={
          <PrivateRoute>
            <BudgetPage />
          </PrivateRoute>
        }
      />
      <Route path='/signin' element={<SignInPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='*' element={<Navigate to='/customer' replace />} />
    </Routes>
  )
}

export default AppRoutes

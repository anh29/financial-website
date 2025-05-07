import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import HomePage from '../../pages/HomePage/HomePage'
import IncomeExpensePage from '../../pages/IncomeExpensePage/IncomeExpensePage'
import FinancialStatementsPage from '../../pages/FinancialStatementsPage/FinancialStatementsPage'
import BudgetSuggestionsPage from '../../pages/BudgetSuggestionsPage/BudgetSuggestionsPage'
import FinancialAdvicePage from '../../pages/FinancialAdvicePage/FinancialAdvicePage'
import SignInPage from '../../pages/SignInPage/SignInPage'
import SignupPage from '../../pages/SignupPage/SignupPage'
import TransactionPage from '../../pages/TransactionPage/TransactionPage'
import UpcomingPage from '../../pages/UpcomingPage/UpcomingPage'
import ExpensesPage from '../../pages/ExpensesPage/ExpensesPage'
import GoalPage from '../../pages/GoalPage/GoalPage'
import SettingsPage from '../../pages/SettingsPage/SettingsPage'
import ReportsPage from '../../pages/ReportsPage/ReportsPage'
import BudgetPage from '../../pages/BudgetPage/BudgetPage'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path='/'
      element={
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      }
    />
    <Route
      path='/income-expense'
      element={
        <PrivateRoute>
          <IncomeExpensePage />
        </PrivateRoute>
      }
    />
    <Route
      path='/financial-statements'
      element={
        <PrivateRoute>
          <FinancialStatementsPage />
        </PrivateRoute>
      }
    />
    <Route
      path='/budget-suggestions'
      element={
        <PrivateRoute>
          <BudgetSuggestionsPage />
        </PrivateRoute>
      }
    />
    <Route
      path='/financial-advice'
      element={
        <PrivateRoute>
          <FinancialAdvicePage />
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
      path='/upcoming'
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
      path='/goal'
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
    <Route
      path='/reports'
      element={
        <PrivateRoute>
          <ReportsPage />
        </PrivateRoute>
      }
    />
    <Route path='/signin' element={<SignInPage />} />
    <Route path='/signup' element={<SignupPage />} />
  </Routes>
)

export default AppRoutes

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import HomePage from '../../pages/HomePage/HomePage'
import IncomeExpensePage from '../../pages/IncomeExpensePage/IncomeExpensePage'
import FinancialStatementsPage from '../../pages/FinancialStatementsPage/FinancialStatementsPage'
import BudgetSuggestionsPage from '../../pages/BudgetSuggestionsPage/BudgetSuggestionsPage'
import FinancialAdvicePage from '../../pages/FinancialAdvicePage/FinancialAdvicePage'
import SignInPage from '../../pages/SignInPage/SignInPage'
import SignupPage from '../../pages/SignUpPage/SignUpPage'
import TransactionPage from '../../pages/TransactionPage/TransactionPage'
import UpcomingPage from '../../pages/UpcomingPage/UpcomingPage'
import ExpensesPage from '../../pages/ExpensesPage/ExpensesPage'
import SettingsPage from '../../pages/SettingsPage/SettingsPage'
import ReportsPage from '../../pages/ReportsPage/ReportsPage'
import BudgetPage from '../../pages/BudgetPage/BudgetPage'
import { CustomerLayout } from '../CustomerComponents/CustomerLayout/CustomerLayout'
import ValueAnalysis from '../CustomerComponents/FeaturesSection/ValueAnalysis'
import DailyTracking from '../CustomerComponents/FeaturesSection/DailyTracking'
import DailyCost from '../CustomerComponents/FeaturesSection/DailyCost'
import ExpenseScore from '../CustomerComponents/FeaturesSection/ExpenseScore'
import SmartDecisions from '../CustomerComponents/FeaturesSection/SmartDecisions'
import AIAlerts from '../CustomerComponents/FeaturesSection/AIAlerts'
import EmotionTags from '../CustomerComponents/FeaturesSection/EmotionTags'
import CustomerPage from '../../pages/CustomerPage/CustomerPage'
import GoalPage from '../../pages/GoalPage/GoalPage'
import FeaturesPage from '../CustomerComponents/FeaturesSection/FeaturesPage'
import BlogPage from '../CustomerComponents/BlogSection/BlogPage'
import SupportPage from '../CustomerComponents/SupportSection/SupportPage'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path='/customer'
      element={
        <CustomerLayout>
          <CustomerPage />
        </CustomerLayout>
      }
    >
      <Route path='features' element={<FeaturesPage />}>
        <Route path='daily-tracking' element={<DailyTracking />} />
        <Route path='daily-cost' element={<DailyCost />} />
        <Route path='value-analysis' element={<ValueAnalysis />} />
        <Route path='smart-decisions' element={<SmartDecisions />} />
        <Route path='ai-alerts' element={<AIAlerts />} />
        <Route path='expense-score' element={<ExpenseScore />} />
        <Route path='emotion-tags' element={<EmotionTags />} />
      </Route>
      <Route path='blog' element={<BlogPage />} />
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
    <Route path='*' element={<Navigate to='/customer' replace />} />
  </Routes>
)

export default AppRoutes

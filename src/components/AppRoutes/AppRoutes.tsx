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
import SettingsPage from '../../pages/SettingsPage/SettingsPage'
import ReportsPage from '../../pages/ReportsPage/ReportsPage'
import BudgetPage from '../../pages/BudgetPage/BudgetPage'
import GoalPage from '../../pages/GoalPage/GoalPage'
import { CustomerLayout } from '../features/CustomerLayout/CustomerLayout'
import SupportRoutes from '../../routes/SupportRoutes'
import ValueAnalysis from '../features/Features/ValueAnalysis'
import DailyTracking from '../features/Features/DailyTracking'
import DailyCost from '../features/Features/DailyCost'
import ExpenseScore from '../features/Features/ExpenseScore'
import SmartDecisions from '../features/Features/SmartDecisions'
import AIAlerts from '../features/Features/AIAlerts'
import EmotionTags from '../features/Features/EmotionTags'
import Support from '../features/Support/Support'
import { Blog } from '../features/Blog/Blog'
import { BlogDetail } from '../features/Blog/BlogDetail/BlogDetail'
import Customer from '../../pages/Customer/Customer'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path='/customer'
      element={
        <CustomerLayout>
          <Customer />
        </CustomerLayout>
      }
    >
      <Route path='features/daily-tracking' element={<DailyTracking />} />
      <Route path='features/daily-cost' element={<DailyCost />} />
      <Route path='features/value-analysis' element={<ValueAnalysis />} />
      <Route path='features/smart-decisions' element={<SmartDecisions />} />
      <Route path='features/ai-alerts' element={<AIAlerts />} />
      <Route path='features/expense-score' element={<ExpenseScore />} />
      <Route path='features/emotion-tags' element={<EmotionTags />} />
      <Route path='support' element={<Support />} />
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
    <Route
      path='/customer/support/*'
      element={
        <CustomerLayout>
          <SupportRoutes />
        </CustomerLayout>
      }
    />
    <Route
      path='/customer/blog'
      element={
        <CustomerLayout>
          <Blog />
        </CustomerLayout>
      }
    />
    <Route
      path='/customer/blog/:id'
      element={
        <CustomerLayout>
          <BlogDetail
            post={{
              id: '1',
              title: 'Blog 1',
              content: 'Blog 1 content',
              date: '2021-01-01',
              category: 'Category 1',
              author: 'Author 1',
              image: 'https://via.placeholder.com/150'
            }}
          />
        </CustomerLayout>
      }
    />
  </Routes>
)

export default AppRoutes

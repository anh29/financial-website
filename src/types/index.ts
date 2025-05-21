import { Transaction } from './transaction'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Budget {
  id: string
  description: string
  amount: number
  allocations: BudgetAllocation[]
  [key: string]: string | number | undefined | BudgetAllocation[]
}

export interface BudgetAllocation {
  monthly_budget_id: string
  description: string
  amount: number
  [key: string]: string | number | undefined
}

export interface HistoryBudgets {
  month: string
  total: number
  disposable: number
  allocations: BudgetAllocation[]
  spent: Record<string, number>
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: string
}

export type Theme = 'light' | 'dark'

export interface AppState {
  user: User | null
  transactions: Transaction[]
  budgets: Budget[]
  notifications: Notification[]
  theme: Theme
  isLoading: boolean
  error: string | null
}

import { Budget } from './budgets'
import { Transaction } from './transaction'

export interface User {
  id: string
  email: string
  name: string
  username?: string
  avatar?: string
  email_verified?: boolean
  via_google?: boolean
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

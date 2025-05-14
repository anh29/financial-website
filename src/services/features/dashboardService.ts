import { apiClient } from '../../config/apiClient'

export interface DashboardData {
  totalBalance: number
  accounts: Array<{
    type: string
    number: string
    balance: number
  }>
  goals: {
    target: number
    achieved: number
    thisMonth: number
  }
  upcomingBills: Array<{
    date: string
    name: string
    amount: number
  }>
  recentTransactions: Array<{
    name: string
    category: string
    amount: number
  }>
  statistics: {
    weeklyComparison: Array<{
      day: string
      thisWeek: number
      lastWeek: number
    }>
    expensesBreakdown: Array<{
      category: string
      amount: number
      percentage: number
    }>
  }
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/api/dashboard')
    return response.data
  }
}

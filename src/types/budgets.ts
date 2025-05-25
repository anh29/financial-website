export interface Budget {
  id: string
  description: string
  amount: number
  allocations: BudgetAllocation[]
  [key: string]: string | number | undefined | BudgetAllocation[]
}

export interface RemainingBudget {
  remainingBudget: number
  totalSpent: number
  totalBudget: number
  month: string
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

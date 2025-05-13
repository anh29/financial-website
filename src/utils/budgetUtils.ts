import { SERVER_URL } from './constants'
import { Budget, BudgetAllocation, HistoryBudgets } from '../types'

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

export const createBudget = async (budget: Budget[]): Promise<void> => {
  const body = budget.map((item) => ({
    userId: user.id,
    ...item
  }))
  const response = await fetch(`${SERVER_URL}/crud/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error('Failed to create budget')
  }
  const data = await response.json()
  return data
}

export const updateBudget = async (budget: Budget): Promise<void> => {
  const response = await fetch(`${SERVER_URL}/crud/budgets/${budget.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  })
  if (!response.ok) {
    throw new Error('Failed to update budget')
  }
  const data = await response.json()
  return data
}

export const createMonthlyBudget = async (budget: Budget[]): Promise<void> => {
  const body = budget.map((item) => ({
    userId: user.id,
    ...item
  }))
  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error('Failed to create budget')
  }
  const data = await response.json()
  return data
}

export const updateMonthlyBudget = async (budget: Budget): Promise<void> => {
  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets/${budget.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  })
  if (!response.ok) {
    throw new Error('Failed to update budget')
  }
  const data = await response.json()
  return data
}

export const fetchMonthlyBudgetsByUser = async (): Promise<{ message: string; data: Budget[] }> => {
  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets/user/${user.id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch monthly budgets')
  }

  return response.json()
}

export const fetchBudgetAllocations = async (): Promise<{ message: string; data: Budget[] }> => {
  const response = await fetch(`${SERVER_URL}/crud/budgets/user/${user.id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch budget allocations')
  }

  return response.json()
}
export const saveBudgetAllocations = async (allocations: Budget[]): Promise<void> => {
  const body = allocations.map((allocation) => ({
    userId: user.id,
    ...allocation
  }))
  const response = await fetch(`${SERVER_URL}/crud/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Failed to save budget allocations')
  }
}

export const saveMonthlyBudget = async (monthlyBudget: { amount: number; month: string }[]): Promise<void> => {
  const body = monthlyBudget.map((budget) => ({
    userId: user.id,
    ...budget
  }))
  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Failed to save monthly budget')
  }
}

export const saveMonthlyBudgetAllocation = async (allocation: BudgetAllocation[]): Promise<void> => {
  const body = allocation.map((item) => ({
    userId: user.id,
    ...item
  }))
  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgetAllocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Failed to save monthly budget allocation')
  }
}

export const fetchMonthlyBudgetWithAllocations = async (month: string): Promise<{ message: string; data: Budget }> => {
  const response = await fetch(
    `${SERVER_URL}/marketplace/getMonthlyBudgetWithAllocations/user/${user.id}/month/${month}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch monthly budget with allocations')
  }

  return response.json()
}

export const fetchBudgetsByUser = async (): Promise<{
  message: string
  data: { budgets: Budget[]; income: Budget }
}> => {
  const response = await fetch(`${SERVER_URL}/marketplace/getUserIncomeAndBudgets/user/${user.id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch budgets')
  }

  return response.json()
}

export const getHistoricalExpenditures = async (): Promise<{ message: string; data: HistoryBudgets[] }> => {
  const response = await fetch(`${SERVER_URL}/marketplace/getHistoricalExpenditures/user/${user.id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch historical expenditures')
  }

  return response.json()
}

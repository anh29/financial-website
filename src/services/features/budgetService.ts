import { Budget, BudgetAllocation, HistoryBudgets, RemainingBudget } from '../../types/budgets'
import { SERVER_URL } from '../../utils/constants'
import { getUser } from '../../utils/userUtils'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'An error occurred')
  }
  return response.json()
}

export const createBudget = async (budget: Budget[]): Promise<void> => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const body = budget.map((item) => ({
    userId: user.id,
    ...item
  }))

  const response = await fetch(`${SERVER_URL}/crud/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  await handleResponse(response)
}

export const updateBudget = async (budget: Budget): Promise<void> => {
  const response = await fetch(`${SERVER_URL}/crud/budgets/${budget.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  })

  await handleResponse(response)
}

export const createMonthlyBudget = async (budget: Budget[]): Promise<void> => {
  const body = budget.map((item) => ({
    userId: getUser().id,
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
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets/user/${user.id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch monthly budgets')
  }

  return response.json()
}

export const fetchBudgetAllocations = async (): Promise<{ message: string; data: Budget[] }> => {
  const response = await fetch(`${SERVER_URL}/crud/budgets/user/${getUser().id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch budget allocations')
  }

  return response.json()
}
export const saveBudgetAllocations = async (allocations: Budget[]): Promise<void> => {
  const body = allocations.map((allocation) => ({
    userId: getUser().id,
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
  const user = getUser()
  if (!user) throw new Error('User not found')

  const body = monthlyBudget.map((budget) => ({
    userId: user.id,
    ...budget
  }))

  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  await handleResponse(response)
}

export const saveMonthlyBudgetAllocation = async (allocation: BudgetAllocation[]): Promise<void> => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const body = allocation.map((item) => ({
    userId: user.id,
    ...item
  }))

  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgetAllocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  await handleResponse(response)
}

export const fetchMonthlyBudgetWithAllocations = async (month: string): Promise<{ message: string; data: Budget }> => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(
    `${SERVER_URL}/marketplace/getMonthlyBudgetWithAllocations/user/${user.id}/month/${month}`
  )

  return handleResponse(response)
}

export const fetchBudgetsByUser = async (): Promise<{
  message: string
  data: { budgets: Budget[]; income: Budget }
}> => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(`${SERVER_URL}/marketplace/getUserIncomeAndBudgets/user/${user.id}`)

  return handleResponse(response)
}

export const getHistoricalExpenditures = async (): Promise<{ message: string; data: HistoryBudgets[] }> => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(`${SERVER_URL}/marketplace/getHistoricalExpenditures/user/${user.id}`)

  return handleResponse(response)
}

export const getRemainingBudget = async (month: string): Promise<{ message: string; data: RemainingBudget }> => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(`${SERVER_URL}/marketplace/getRemainingBudget/user/${user.id}/month/${month}`)

  return handleResponse(response)
}

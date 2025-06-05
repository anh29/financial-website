import { Budget, BudgetAllocation, HistoryBudgets, MonthlyBudget, RemainingBudget } from '../../types/budgets'
import { SERVER_URL } from '../../utils/constants'
import { getUser } from '../../utils/userUtils'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Đã xảy ra lỗi')
  }
  return response.json()
}

export const createBudget = async (budget: Budget[]): Promise<void> => {
  const user = getUser()
  if (!user) throw new Error('Không tìm thấy người dùng')

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

export const createMonthlyBudget = async (monthlyBudget: Omit<MonthlyBudget, 'id'>[]): Promise<void> => {
  const body = monthlyBudget.map((item) => ({
    userId: getUser().id,
    ...item
  }))
  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error('Không thể tạo ngân sách')
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
    throw new Error('Không thể cập nhật ngân sách')
  }
  const data = await response.json()
  return data
}

export const fetchMonthlyBudgetsByUser = async (): Promise<{ message: string; data: Budget[] }> => {
  const user = getUser()
  if (!user) throw new Error('Không tìm thấy người dùng')

  const response = await fetch(`${SERVER_URL}/crud/monthlyBudgets/user/${user.id}`)

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách ngân sách hàng tháng')
  }

  return response.json()
}

export const fetchBudgetAllocations = async (): Promise<{ message: string; data: Budget[] }> => {
  const response = await fetch(`${SERVER_URL}/crud/budgets/user/${getUser().id}`)

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách phân bổ ngân sách')
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
    throw new Error('Không thể lưu phân bổ ngân sách')
  }
}

export const saveMonthlyBudget = async (monthlyBudget: { amount: number; month: string }[]): Promise<void> => {
  const user = getUser()
  if (!user) throw new Error('Không tìm thấy người dùng')

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
  if (!user) throw new Error('Không tìm thấy người dùng')

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
  if (!user) throw new Error('Không tìm thấy người dùng')

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
  if (!user) throw new Error('Không tìm thấy người dùng')

  const response = await fetch(`${SERVER_URL}/marketplace/getUserIncomeAndBudgets/user/${user.id}`)

  return handleResponse(response)
}

export const getHistoricalExpenditures = async (): Promise<{ message: string; data: HistoryBudgets[] }> => {
  const user = getUser()
  if (!user) throw new Error('Không tìm thấy người dùng')

  const response = await fetch(`${SERVER_URL}/marketplace/getHistoricalExpenditures/user/${user.id}`)

  return handleResponse(response)
}

export const getRemainingBudget = async (month: string): Promise<{ message: string; data: RemainingBudget }> => {
  const user = getUser()
  if (!user) throw new Error('Không tìm thấy người dùng')

  const response = await fetch(`${SERVER_URL}/marketplace/getRemainingBudget/user/${user.id}/month/${month}`)

  return handleResponse(response)
}

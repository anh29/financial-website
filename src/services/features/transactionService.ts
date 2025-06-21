import { Transaction } from '../../types/transaction'
import { apiClient } from '../../config/apiClient'
import { getUser } from '../../utils/userUtils'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'

export const fetchTransactionsByUser = async () => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await apiClient.get(`/crud/transactions/user/${user.id}`)
  return response.data
}

export const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const response = await apiClient.post('/crud/transactions', transaction)
  return response.data
}

export const updateTransaction = async (transaction: Transaction) => {
  const response = await apiClient.put(`/crud/transactions/${transaction.id}`, transaction)
  return response.data
}

export const updateTransactionById = async (updatedTransaction: Partial<Transaction>) => {
  const response = await apiClient.put('/crud/transactions', updatedTransaction)
  return response.data
}

export const deleteTransaction = async (id: string) => {
  await apiClient.delete(`/crud/transactions/${id}`)
}

export const importTransactions = async (newTransactions: Transaction[]) => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const allCategories = [...expenseCategories, ...incomeCategories]

  const transactionsWithUser = newTransactions.map((tx) => ({
    ...tx,
    category: allCategories.find((cat) => cat.key === tx.category)?.label,
    userId: user.id
  }))

  const response = await apiClient.post('/crud/transactions', transactionsWithUser)
  return response.data
}

export const classifyTransaction = async ({
  description
}: {
  description?: string
}): Promise<{ predictedCategory: { label: string; key: string } }> => {
  const response = await apiClient.post('/marketplace/category', { description })
  return response.data
}

export const predictUsageDuration = async (transaction: { amount: number; category: string }) => {
  const user = await getUser()
  if (!user) throw new Error('User not found')

  const response = await apiClient.post('/marketplace/predictUsageDuration', { ...transaction, userId: user.id })
  return response.data.data
}

export const getExpensesTransactions = async () => {
  const user = await getUser()
  if (!user) throw new Error('User not found')

  const response = await apiClient.get(`/marketplace/getExpensesTransactions/user/${user.id}`)
  return response.data
}

export const getLatestTransactions = async () => {
  const user = await getUser()
  if (!user) throw new Error('User not found')

  const response = await apiClient.get(`/marketplace/getLatestTransaction/user/${user.id}`)
  return response.data
}

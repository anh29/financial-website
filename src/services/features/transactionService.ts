import { Transaction } from '../../types/transaction'
import { SERVER_URL } from '../../utils/constants'
import { getUser } from '../../utils/userUtils'
import { expenseCategories, incomeCategories } from '../../utils/categoryUtils'

const API_URL = SERVER_URL ?? 'http://localhost:3500'

export const fetchTransactionsByUser = async () => {
  const user = getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(`${API_URL}/crud/transactions/user/${user.id}`)
  if (!response.ok) throw new Error('Failed to fetch transactions')

  return await response.json()
}

export const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const response = await fetch(`${API_URL}/crud/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  })
  if (!response.ok) throw new Error('Failed to create transaction')

  return await response.json()
}

export const updateTransaction = async (transaction: Transaction) => {
  const response = await fetch(`${API_URL}/crud/transactions/${transaction.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  })
  if (!response.ok) throw new Error('Failed to update transaction')

  return await response.json()
}

export const updateTransactionById = async (updatedTransaction: Partial<Transaction>) => {
  const response = await fetch(`${API_URL}/crud/transactions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTransaction)
  })
  if (!response.ok) throw new Error('Failed to update transaction')

  return await response.json()
}

export const deleteTransaction = async (id: string) => {
  const response = await fetch(`${API_URL}/crud/transactions/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete transaction')
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

  const response = await fetch(`${API_URL}/crud/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionsWithUser)
  })

  if (!response.ok) throw new Error('Failed to import transactions')

  return await response.json()
}

export const classifyTransaction = async ({
  description
}: {
  description?: string
}): Promise<{ predictedCategory: { label: string; key: string } }> => {
  const response = await fetch(`${SERVER_URL}/marketplace/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  })

  if (!response.ok) throw new Error('Failed to classify category')

  return await response.json()
}

export const predictUsageDuration = async (transaction: { amount: number; category: string }) => {
  const user = await getUser()
  if (!user) throw new Error('User not found')

  const response = await fetch(`${SERVER_URL}/marketplace/predictUsageDuration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...transaction, userId: user.id })
  })

  if (!response.ok) throw new Error('Failed to predict usage duration')

  const { data } = await response.json()
  return data
}

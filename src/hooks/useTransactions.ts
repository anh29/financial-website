import { useAppSelector, useAppDispatch } from '../store'
import type { Transaction } from '../types/transaction'
import axios from 'axios'
import { SERVER_URL } from '../utils/constants'
import { useEffect, useCallback } from 'react'
import { Transaction as TransactionType } from '../types/transaction'
import { Transaction as TransactionModalType } from '../components/TransactionPage/TransactionModal'
import { expenseCategories, incomeCategories } from '../utils/categoryUtils'
import { setTransactions } from '../store/slices/transactionSlice'

const API_URL = SERVER_URL ?? 'http://localhost:3500'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

export const useTransactions = () => {
  const {
    transactions = [],
    isLoading = false,
    error = null
  } = useAppSelector((state) => state.transactions || {}) as Partial<TransactionState>

  const dispatch = useAppDispatch()

  const fetchTransactions = useCallback(async () => {
    try {
      const localStorageData = localStorage.getItem('user')
      const userId = localStorageData ? JSON.parse(localStorageData).id : null
      if (!userId) throw new Error('User not found in localStorage')

      const response = await axios.get(`${SERVER_URL}/crud/transactions/user/${userId}`)

      dispatch(setTransactions(response.data.data))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch transactions')
    }
  }, [dispatch])

  const handleImport = async (newTransactions: TransactionModalType[]) => {
    try {
      const localStorageData = localStorage.getItem('user')
      const userId = localStorageData ? JSON.parse(localStorageData).id : null
      if (!userId) throw new Error('User not found in localStorage')

      const allCategories = [...expenseCategories, ...incomeCategories]

      const transactionsWithUser = newTransactions.map((tx: TransactionModalType) => ({
        ...tx,
        category: allCategories.find((cat) => cat.key === tx.category)?.label,
        userId
      }))

      const response = await axios.post(`${SERVER_URL}/crud/transactions`, transactionsWithUser)
      return response.data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to import transactions')
    }
  }

  const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await axios.post<Transaction>(`${API_URL}/crud/transactions`, transaction)
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create transaction')
    }
  }

  const updateTransactionById = async (updatedTransaction: TransactionType): Promise<TransactionType> => {
    try {
      const response = await axios.put(`${SERVER_URL}/crud/transactions`, updatedTransaction)
      return response.data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update transaction')
    }
  }

  const deleteTransactionById = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/crud/transactions/${id}`)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete transaction')
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransactionById,
    deleteTransactionById,
    handleImport
  }
}

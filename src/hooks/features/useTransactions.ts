import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  fetchTransactionsAsync,
  createTransactionAsync,
  updateTransactionAsync,
  deleteTransactionAsync,
  importTransactionsAsync
} from '../../store/slices/transactionSlice'
import { Transaction } from '../../types/transaction'

export const useTransactions = () => {
  const dispatch = useAppDispatch()
  const { transactions, isLoading, error } = useAppSelector((state) => state.transactions)

  const fetchTransactions = useCallback(async () => {
    try {
      await dispatch(fetchTransactionsAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }, [dispatch])

  const createTransactionHandler = useCallback(
    async (transaction: Omit<Transaction, 'id'>) => {
      try {
        await dispatch(createTransactionAsync(transaction)).unwrap()
        await fetchTransactions()
      } catch (error) {
        console.error('Failed to create transaction:', error)
      }
    },
    [dispatch, fetchTransactions]
  )

  const updateTransactionHandler = useCallback(
    async (transaction: Transaction) => {
      try {
        await dispatch(updateTransactionAsync(transaction)).unwrap()
      } catch (error) {
        console.error('Failed to update transaction:', error)
        throw error
      }
    },
    [dispatch]
  )

  const deleteTransactionHandler = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteTransactionAsync(id)).unwrap()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    },
    [dispatch]
  )

  const handleImport = useCallback(
    async (newTransactions: Transaction[]) => {
      try {
        await dispatch(importTransactionsAsync(newTransactions)).unwrap()
        await fetchTransactions()
      } catch (error) {
        console.error('Failed to import transactions:', error)
      }
    },
    [dispatch, fetchTransactions]
  )

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions, // Manual trigger for fetching transactions
    createTransactionHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
    handleImport
  }
}

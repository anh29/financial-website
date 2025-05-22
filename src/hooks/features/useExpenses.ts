import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { getExpensesTransactionsAsync } from '../../store/slices/transactionSlice'

export const useExpenses = () => {
  const dispatch = useAppDispatch()
  const { transactions, isLoading, error } = useAppSelector((state) => state.transactions)

  const fetchExpenses = useCallback(async () => {
    try {
      await dispatch(getExpensesTransactionsAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    }
  }, [dispatch])

  return {
    expenses: transactions,
    isLoading,
    error,
    fetchExpenses
  }
}

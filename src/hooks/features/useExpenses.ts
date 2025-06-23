import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { getExpensesTransactionsAsync, getMonthlyCategoryExpensesAsync } from '../../store/slices/transactionSlice'

export const useExpenses = () => {
  const dispatch = useAppDispatch()
  const { transactions, isLoading, error, monthlyCategoryExpenses } = useAppSelector((state) => state.transactions)

  const fetchExpenses = useCallback(async () => {
    try {
      await dispatch(getExpensesTransactionsAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    }
  }, [dispatch])

  const fetchMonthlyCategoryExpenses = useCallback(async () => {
    try {
      await dispatch(getMonthlyCategoryExpensesAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch monthly category expenses:', error)
    }
  }, [dispatch])

  return {
    expenses: transactions,
    isLoading,
    error,
    fetchExpenses,
    fetchMonthlyCategoryExpenses,
    monthlyCategoryExpenses
  }
}

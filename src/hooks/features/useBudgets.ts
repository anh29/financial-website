import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  fetchBudgetsAsync,
  createBudgetAsync,
  updateBudgetAsync,
  fetchHistoricalExpendituresAsync,
  fetchRemainingBudgetAsync
} from '../../store/slices/budgetSlice'
import { Budget, BudgetAllocation } from '../../types/budgets'
import {
  saveMonthlyBudgetAllocation,
  saveMonthlyBudget,
  fetchMonthlyBudgetWithAllocations
} from '../../services/features/budgetService'

export const useBudgets = () => {
  const dispatch = useAppDispatch()
  const { budgets, income, pastBudgets, isLoading, error, remainingBudget } = useAppSelector((state) => state.budgets)

  const fetchBudgets = useCallback(async () => {
    try {
      await dispatch(fetchBudgetsAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    }
  }, [dispatch])

  const createBudgetHandler = useCallback(
    async (budget: Budget[]) => {
      try {
        await dispatch(createBudgetAsync(budget)).unwrap()
      } catch (error) {
        console.error('Failed to create budget:', error)
      }
    },
    [dispatch]
  )

  const updateBudgetHandler = useCallback(
    async (budget: Budget) => {
      try {
        await dispatch(updateBudgetAsync(budget)).unwrap()
      } catch (error) {
        console.error('Failed to update budget:', error)
      }
    },
    [dispatch]
  )

  const fetchHistoricalExpenditures = useCallback(async () => {
    try {
      await dispatch(fetchHistoricalExpendituresAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch historical expenditures:', error)
    }
  }, [dispatch])

  const saveMonthlyBudgetHandler = useCallback(
    async (monthlyBudget: { amount: number; month: string }[]) => {
      try {
        await saveMonthlyBudget(monthlyBudget)
        await fetchBudgets()
      } catch (error) {
        console.error('Failed to save monthly budget:', error)
      }
    },
    [fetchBudgets]
  )

  const saveMonthlyBudgetAllocationHandler = useCallback(
    async (allocation: BudgetAllocation[]) => {
      try {
        await saveMonthlyBudgetAllocation(allocation)
        await fetchBudgets()
      } catch (error) {
        console.error('Failed to save monthly budget allocation:', error)
      }
    },
    [fetchBudgets]
  )

  const fetchMonthlyBudgetAllocations = useCallback(async (month: string): Promise<Budget> => {
    try {
      const { data } = await fetchMonthlyBudgetWithAllocations(month)
      return data
    } catch (error) {
      console.error('Failed to fetch monthly budget allocations:', error)
      return {} as Budget
    }
  }, [])

  const getRemainingBudgetHandler = useCallback(
    async (month: string): Promise<void> => {
      try {
        await dispatch(fetchRemainingBudgetAsync(month)).unwrap()
      } catch (error) {
        console.error('Failed to get remaining budget:', error)
      }
    },
    [dispatch]
  )

  return {
    budgets,
    income,
    pastBudgets,
    isLoading,
    error,
    fetchBudgets,
    createBudgetHandler,
    updateBudgetHandler,
    fetchHistoricalExpenditures,
    saveMonthlyBudgetHandler,
    saveMonthlyBudgetAllocationHandler,
    fetchMonthlyBudgetAllocations,
    getRemainingBudgetHandler,
    remainingBudget
  }
}

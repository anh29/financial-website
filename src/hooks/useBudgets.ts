import { useAppSelector, useAppDispatch } from '../store'
import { setBudgets, setLoading, setError, setIncome, setPastBudgets } from '../store/slices/budgetSlice'
import type { Budget, BudgetAllocation } from '../types'
import {
  fetchBudgetsByUser,
  createBudget,
  updateBudget,
  fetchMonthlyBudgetsByUser,
  saveMonthlyBudget,
  fetchMonthlyBudgetWithAllocations,
  saveMonthlyBudgetAllocation,
  getHistoricalExpenditures
} from '../utils/budgetUtils'
import { useCallback } from 'react'

export const useBudgets = () => {
  const dispatch = useAppDispatch()
  const { budgets, income, pastBudgets, isLoading, error } = useAppSelector((state) => state.budgets)

  const fetchBudgets = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const rawData = await fetchBudgetsByUser()
      const data = rawData.data.budgets.map((item) => ({
        ...item,
        allocations: []
      }))

      dispatch(setIncome(rawData.data.income))
      dispatch(setBudgets(data))
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch budgets'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const createBudgetHandler = async (budget: Budget[]) => {
    try {
      dispatch(setLoading(true))
      await createBudget(budget)
      fetchBudgets()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create budget'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const updateBudgetHandler = async (id: string, updates: Partial<Budget>) => {
    try {
      dispatch(setLoading(true))
      const updatedBudget: Budget = { id, ...updates } as Budget
      await updateBudget(updatedBudget)
      fetchBudgets()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update budget'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchHistoricalExpenditures = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const response = await getHistoricalExpenditures()
      dispatch(setPastBudgets(response.data))
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch historical expenditures'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const fetchMonthlyBudgets = async () => {
    try {
      dispatch(setLoading(true))
      const data = await fetchMonthlyBudgetsByUser()
      console.log('Monthly budgets fetched:', data)
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch monthly budgets'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const saveMonthlyBudgetHandler = async (monthlyBudget: { amount: number; month: string }[]) => {
    try {
      dispatch(setLoading(true))
      await saveMonthlyBudget(monthlyBudget)
      fetchMonthlyBudgets()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to save monthly budget'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchMonthlyBudgetAllocations = useCallback(
    async (month: string): Promise<Budget> => {
      try {
        dispatch(setLoading(true))
        const { data } = await fetchMonthlyBudgetWithAllocations(month)
        return data
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch monthly budget allocations'))
        return {} as Budget
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch]
  )

  const saveMonthlyBudgetAllocationHandler = async (allocation: BudgetAllocation[]) => {
    try {
      dispatch(setLoading(true))
      await saveMonthlyBudgetAllocation(allocation)
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to save monthly budget allocation'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return {
    budgets,
    income,
    pastBudgets,
    fetchHistoricalExpenditures,
    isLoading,
    error,
    fetchBudgets,
    createBudgetHandler,
    updateBudgetHandler,
    fetchMonthlyBudgets,
    saveMonthlyBudgetHandler,
    fetchMonthlyBudgetAllocations,
    saveMonthlyBudgetAllocationHandler
  }
}

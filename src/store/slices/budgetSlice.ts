import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Budget, HistoryBudgets } from '../../types'

interface BudgetState {
  budgets: Budget[]
  income: Budget | null
  pastBudgets: HistoryBudgets[]
  isLoading: boolean
  error: string | null
}

const initialState: BudgetState = {
  budgets: [],
  income: null,
  pastBudgets: [],
  isLoading: false,
  error: null
}

// Utility function to find a budget by ID
const findBudgetIndex = (budgets: Budget[], id: string) => budgets.findIndex((b) => b.id === id)

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload
    },
    setIncome: (state, action: PayloadAction<Budget | null>) => {
      state.income = action.payload
    },
    setPastBudgets: (state, action: PayloadAction<HistoryBudgets[]>) => {
      state.pastBudgets = action.payload
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload)
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = findBudgetIndex(state.budgets, action.payload.id)
      if (index !== -1) {
        state.budgets[index] = action.payload
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter((b) => b.id !== action.payload)
    },
    updateBudgetSpent: (state, action: PayloadAction<{ id: string; spent: number }>) => {
      const index = findBudgetIndex(state.budgets, action.payload.id)
      if (index !== -1) {
        state.budgets[index].spent = action.payload.spent
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  setBudgets,
  setIncome,
  setPastBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  updateBudgetSpent,
  setLoading,
  setError
} = budgetSlice.actions

export default budgetSlice.reducer

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Budget, HistoryBudgets, RemainingBudget } from '../../types/budgets'
import { findById } from '../utils/common'
import {
  fetchBudgetsByUser,
  createBudget,
  updateBudget,
  getHistoricalExpenditures,
  getRemainingBudget
} from '../../services/features/budgetService'

interface BudgetState {
  budgets: Budget[]
  income: Budget | null
  pastBudgets: HistoryBudgets[]
  isLoading: boolean
  error: string | null
  remainingBudget: RemainingBudget | null
}

const initialState: BudgetState = {
  budgets: [],
  income: null,
  pastBudgets: [],
  isLoading: false,
  error: null,
  remainingBudget: null
}

// Async thunks
export const fetchBudgetsAsync = createAsyncThunk('budgets/fetchBudgets', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchBudgetsByUser()
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Không thể lấy danh sách ngân sách')
  }
})

export const createBudgetAsync = createAsyncThunk(
  'budgets/createBudget',
  async (budget: Budget[], { rejectWithValue }) => {
    try {
      await createBudget(budget)
      const response = await fetchBudgetsByUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể tạo ngân sách')
    }
  }
)

export const updateBudgetAsync = createAsyncThunk(
  'budgets/updateBudget',
  async (budget: Budget, { rejectWithValue }) => {
    try {
      await updateBudget(budget)
      const response = await fetchBudgetsByUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể cập nhật ngân sách')
    }
  }
)

export const fetchHistoricalExpendituresAsync = createAsyncThunk(
  'budgets/fetchHistoricalExpenditures',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getHistoricalExpenditures()
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể lấy lịch sử chi tiêu')
    }
  }
)

export const fetchRemainingBudgetAsync = createAsyncThunk(
  'budgets/fetchRemainingBudget',
  async (month: string, { rejectWithValue }) => {
    try {
      const response = await getRemainingBudget(month)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể lấy ngân sách còn lại')
    }
  }
)

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    updateBudgetSpent: (state, action: PayloadAction<{ id: string; spent: number }>) => {
      const budget = findById(state.budgets, action.payload.id)
      if (budget) {
        budget.spent = action.payload.spent
      }
    },
    setRemainingBudget: (state, action: PayloadAction<RemainingBudget>) => {
      state.remainingBudget = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Budgets
      .addCase(fetchBudgetsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgetsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload.budgets
        state.income = action.payload.income
      })
      .addCase(fetchBudgetsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Budget
      .addCase(createBudgetAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBudgetAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload.budgets
        state.income = action.payload.income
      })
      .addCase(createBudgetAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Budget
      .addCase(updateBudgetAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudgetAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload.budgets
        state.income = action.payload.income
      })
      .addCase(updateBudgetAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Historical Expenditures
      .addCase(fetchHistoricalExpendituresAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchHistoricalExpendituresAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.pastBudgets = action.payload
      })
      .addCase(fetchHistoricalExpendituresAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Remaining Budget
      .addCase(fetchRemainingBudgetAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRemainingBudgetAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.remainingBudget = action.payload
      })
      .addCase(fetchRemainingBudgetAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setLoading, setError, updateBudgetSpent } = budgetSlice.actions
export default budgetSlice.reducer

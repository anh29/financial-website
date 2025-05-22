import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Transaction } from '../../types/transaction'
import {
  fetchTransactionsByUser,
  createTransaction,
  updateTransactionById as updateTransactionAPI,
  deleteTransaction as deleteTransactionAPI,
  importTransactions,
  getLatestTransactions,
  getExpensesTransactions
} from '../../services/features/transactionService'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null
}

export const fetchTransactionsAsync = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchTransactionsByUser()
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch transactions')
    }
  }
)
export const createTransactionAsync = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Omit<Transaction, 'id'>, { rejectWithValue }) => {
    try {
      await createTransaction(transaction)
      const { data } = await fetchTransactionsByUser()
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create transaction')
    }
  }
)

export const updateTransactionAsync = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const { data } = await updateTransactionAPI(transaction)
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update transaction')
    }
  }
)

export const deleteTransactionAsync = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTransactionAPI(id)
      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete transaction')
    }
  }
)

export const importTransactionsAsync = createAsyncThunk(
  'transactions/importTransactions',
  async (newTransactions: Transaction[], { rejectWithValue }) => {
    try {
      const { data } = await importTransactions(newTransactions)
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to import transactions')
    }
  }
)

export const getLatestTransactionsAsync = createAsyncThunk(
  'transactions/getLatestTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getLatestTransactions()
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch latest transactions')
    }
  }
)

export const getExpensesTransactionsAsync = createAsyncThunk(
  'transactions/getExpensesTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getExpensesTransactions()
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get expenses transactions')
    }
  }
)

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload
      state.error = null
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload)
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(importTransactionsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(importTransactionsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(importTransactionsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(createTransactionAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(getLatestTransactionsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getLatestTransactionsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(getLatestTransactionsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getExpensesTransactionsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getExpensesTransactionsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(getExpensesTransactionsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setTransactions, addTransaction, updateTransaction, deleteTransaction, setLoading, setError } =
  transactionSlice.actions

export default transactionSlice.reducer

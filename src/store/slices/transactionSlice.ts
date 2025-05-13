import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Transaction } from '../../types'

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
  }
})

export const { setTransactions, addTransaction, updateTransaction, deleteTransaction, setLoading, setError } =
  transactionSlice.actions

export default transactionSlice.reducer

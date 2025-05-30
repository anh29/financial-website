import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddBillContributionForm, AddBillForm, UpcomingBill, UpcomingBillContribution } from '../../types/upcoming'
import {
  createUpcomingBill,
  updateUpcomingBill,
  deleteUpcomingBill,
  fetchUpcomingBillsByUserId,
  addUpcomingBillContribution
} from '../../services/features/upcomingService'

interface UpcomingState {
  bills: UpcomingBill[]
  isLoading: boolean
  error: string | null
  billContributions: UpcomingBillContribution[] | null
}

const initialState: UpcomingState = {
  bills: [],
  isLoading: false,
  error: null,
  billContributions: null
}

// Async thunks
export const fetchUpcomingBillsAsync = createAsyncThunk('upcoming/fetchBills', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUpcomingBillsByUserId()
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch upcoming bills')
  }
})

export const createUpcomingBillAsync = createAsyncThunk(
  'upcoming/createBill',
  async (bill: AddBillForm, { rejectWithValue }) => {
    try {
      const createdBill = await createUpcomingBill([bill])
      return createdBill[0]
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create upcoming bill')
    }
  }
)

export const updateUpcomingBillAsync = createAsyncThunk(
  'upcoming/updateBill',
  async (bill: UpcomingBill, { rejectWithValue }) => {
    try {
      return await updateUpcomingBill(bill)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update upcoming bill')
    }
  }
)

export const deleteUpcomingBillAsync = createAsyncThunk(
  'upcoming/deleteBill',
  async (billId: string, { rejectWithValue }) => {
    try {
      await deleteUpcomingBill(billId)
      return billId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete upcoming bill')
    }
  }
)

export const addUpcomingBillContributionAsync = createAsyncThunk(
  'upcoming/addBillContribution',
  async (billContributions: AddBillContributionForm, { rejectWithValue }) => {
    try {
      const contributions = await addUpcomingBillContribution(billContributions)
      return contributions.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add bill contribution')
    }
  }
)

const upcomingSlice = createSlice({
  name: 'upcoming',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bills
      .addCase(fetchUpcomingBillsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUpcomingBillsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = action.payload
      })
      .addCase(fetchUpcomingBillsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Bill
      .addCase(createUpcomingBillAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createUpcomingBillAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills.push(action.payload)
      })
      .addCase(createUpcomingBillAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Bill
      .addCase(updateUpcomingBillAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUpcomingBillAsync.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.bills.findIndex((bill) => bill.bill_id === action.payload.bill_id)
        if (index !== -1) {
          state.bills[index] = action.payload
        }
      })
      .addCase(updateUpcomingBillAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Bill
      .addCase(deleteUpcomingBillAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUpcomingBillAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = state.bills.filter((bill) => bill.bill_id !== action.payload)
      })
      .addCase(deleteUpcomingBillAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add Bill Contribution
      .addCase(addUpcomingBillContributionAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addUpcomingBillContributionAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.billContributions = action.payload
      })
      .addCase(addUpcomingBillContributionAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setLoading, setError } = upcomingSlice.actions
export default upcomingSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Goals } from '../../types/goals'
import { goalThunks } from '../thunks/goalThunks'

interface GoalState {
  goals: Goals[]
  isLoading: boolean
  error: string | null
}

const initialState: GoalState = {
  goals: [],
  isLoading: false,
  error: null
}

// Separate reducers into a separate file
const goalReducers = {
  setLoading: (state: GoalState, action: PayloadAction<boolean>) => {
    state.isLoading = action.payload
  },
  setError: (state: GoalState, action: PayloadAction<string | null>) => {
    state.error = action.payload
  }
}

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: goalReducers,
  extraReducers: (builder) => {
    builder
      // Fetch Goals
      .addCase(goalThunks.fetchGoals.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(goalThunks.fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals = action.payload
      })
      .addCase(goalThunks.fetchGoals.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Goal
      .addCase(goalThunks.createGoal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(goalThunks.createGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals.push(action.payload)
      })
      .addCase(goalThunks.createGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Goal
      .addCase(goalThunks.updateGoal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(goalThunks.updateGoal.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.goals.findIndex((goal) => goal.id === action.payload.id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(goalThunks.updateGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Goal
      .addCase(goalThunks.deleteGoal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(goalThunks.deleteGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals = state.goals.filter((goal) => goal.id !== action.payload)
      })
      .addCase(goalThunks.deleteGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setLoading, setError } = goalSlice.actions
export default goalSlice.reducer

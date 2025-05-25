import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AllocateSavingToGoals, GoalContributions, Goals } from '../../types/goals'
import {
  allocateSavingToGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  fetchGoalsByUserId,
  addGoalContributions
} from '../../services/features/goalService'

interface GoalState {
  goals: Goals[]
  isLoading: boolean
  error: string | null
  allocateSavingToGoals: AllocateSavingToGoals[] | null
  goalContributions: GoalContributions[] | null
}

const initialState: GoalState = {
  goals: [],
  isLoading: false,
  error: null,
  allocateSavingToGoals: null,
  goalContributions: null
}

// Async thunks
export const fetchGoalsAsync = createAsyncThunk('goals/fetchGoals', async (_, { rejectWithValue }) => {
  try {
    return await fetchGoalsByUserId()
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch goals')
  }
})

export const createGoalAsync = createAsyncThunk('goals/createGoal', async (goal: Goals, { rejectWithValue }) => {
  try {
    const createdGoal = await createGoal([goal])
    return createdGoal[0]
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create goal')
  }
})

export const updateGoalAsync = createAsyncThunk('goals/updateGoal', async (goal: Goals, { rejectWithValue }) => {
  try {
    return await updateGoal(goal)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update goal')
  }
})

export const deleteGoalAsync = createAsyncThunk('goals/deleteGoal', async (goalId: string, { rejectWithValue }) => {
  try {
    await deleteGoal(goalId)
    return goalId
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete goal')
  }
})

export const fetchAllocateSavingToGoalsAsync = createAsyncThunk(
  'goals/allocateSavingToGoals',
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await allocateSavingToGoals(amount)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to allocate saving to goals')
    }
  }
)

export const addGoalContributionsAsync = createAsyncThunk(
  'goals/addGoalContributions',
  async (goalContributions: Omit<GoalContributions[], 'id'>, { rejectWithValue }) => {
    try {
      const contributions = await addGoalContributions(goalContributions)
      return contributions.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add goal contributions')
    }
  }
)

const goalSlice = createSlice({
  name: 'goals',
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
      // Fetch Goals
      .addCase(fetchGoalsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGoalsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals = action.payload
      })
      .addCase(fetchGoalsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Goal
      .addCase(createGoalAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createGoalAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals.push(action.payload)
      })
      .addCase(createGoalAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Goal
      .addCase(updateGoalAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateGoalAsync.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.goals.findIndex((goal) => goal.id === action.payload.id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(updateGoalAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Goal
      .addCase(deleteGoalAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteGoalAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals = state.goals.filter((goal) => goal.id !== action.payload)
      })
      .addCase(deleteGoalAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Allocate Saving to Goals
      .addCase(fetchAllocateSavingToGoalsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllocateSavingToGoalsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.allocateSavingToGoals = action.payload
      })
      .addCase(fetchAllocateSavingToGoalsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setLoading, setError } = goalSlice.actions
export default goalSlice.reducer

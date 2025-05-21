import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  createGoal as createGoalAPI,
  updateGoal as updateGoalAPI,
  deleteGoal as deleteGoalAPI,
  fetchGoalsByUserId as fetchGoalsAPI
} from '../../services/features/goalService'
import { Goals } from '../../types/goals'

export const goalThunks = {
  fetchGoals: createAsyncThunk('goals/fetchGoals', async (_, { rejectWithValue }) => {
    try {
      return await fetchGoalsAPI()
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }),

  createGoal: createAsyncThunk('goals/createGoal', async (goal: Goals, { rejectWithValue }) => {
    try {
      const createdGoal = await createGoalAPI([goal])
      return createdGoal[0]
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }),

  updateGoal: createAsyncThunk('goals/updateGoal', async (goal: Goals, { rejectWithValue }) => {
    try {
      return await updateGoalAPI(goal)
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }),

  deleteGoal: createAsyncThunk('goals/deleteGoal', async (goalId: string, { rejectWithValue }) => {
    try {
      await deleteGoalAPI(goalId)
      return goalId
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  })
}

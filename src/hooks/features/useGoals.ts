import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { Goals } from '../../types/goals'
import {
  fetchGoalsAsync,
  createGoalAsync,
  updateGoalAsync,
  deleteGoalAsync,
  fetchAllocateSavingToGoalsAsync,
  addGoalContributionsAsync
} from '../../store/slices/goalSlice'

export const useGoal = () => {
  const dispatch: AppDispatch = useDispatch()
  const { goals, isLoading, error, allocateSavingToGoals, goalContributions } = useSelector(
    (state: RootState) => state.goals
  )

  const getGoals = useCallback(async () => {
    try {
      await dispatch(fetchGoalsAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch goals:', error)
      throw error
    }
  }, [dispatch])

  const addGoal = useCallback(
    async (goal: Goals) => {
      try {
        await dispatch(createGoalAsync(goal)).unwrap()
      } catch (error) {
        console.error('Failed to create goal:', error)
        throw error
      }
    },
    [dispatch]
  )

  const updateGoalInState = useCallback(
    async (goal: Goals) => {
      try {
        await dispatch(updateGoalAsync(goal)).unwrap()
      } catch (error) {
        console.error('Failed to update goal:', error)
        throw error
      }
    },
    [dispatch]
  )

  const removeGoal = useCallback(
    async (goalId: string) => {
      try {
        await dispatch(deleteGoalAsync(goalId)).unwrap()
      } catch (error) {
        console.error('Failed to delete goal:', error)
        throw error
      }
    },
    [dispatch]
  )

  const allocateSavingToGoalsHandler = useCallback(
    async (amount: number) => {
      try {
        await dispatch(fetchAllocateSavingToGoalsAsync(amount)).unwrap()
      } catch (error) {
        console.error('Failed to allocate saving to goals:', error)
        throw error
      }
    },
    [dispatch]
  )

  return {
    goals,
    isLoading,
    error,
    getGoals,
    addGoal,
    updateGoal: updateGoalInState,
    removeGoal,
    allocateSavingToGoals,
    allocateSavingToGoalsHandler,
    addGoalContributionsAsync,
    goalContributions
  }
}

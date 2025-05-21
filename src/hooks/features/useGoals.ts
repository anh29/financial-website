import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { Goals } from '../../types/goals'
import { goalThunks } from '../../store/thunks/goalThunks'

export const useGoal = () => {
  const dispatch: AppDispatch = useDispatch()
  const { goals, isLoading, error } = useSelector((state: RootState) => state.goals)

  const getGoals = useCallback(async () => {
    try {
      await dispatch(goalThunks.fetchGoals()).unwrap()
    } catch (error) {
      console.error('Failed to fetch goals:', error)
      throw error
    }
  }, [dispatch])

  const addGoal = useCallback(
    async (goal: Goals) => {
      try {
        await dispatch(goalThunks.createGoal(goal)).unwrap()
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
        await dispatch(goalThunks.updateGoal(goal)).unwrap()
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
        await dispatch(goalThunks.deleteGoal(goalId)).unwrap()
      } catch (error) {
        console.error('Failed to delete goal:', error)
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
    removeGoal
  }
}

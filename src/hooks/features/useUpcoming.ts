import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { AddBillContributionForm, AddBillForm, UpcomingBill } from '../../types/upcoming'
import {
  fetchUpcomingBillsAsync,
  createUpcomingBillAsync,
  updateUpcomingBillAsync,
  deleteUpcomingBillAsync,
  addUpcomingBillContributionAsync
} from '../../store/slices/upcomingSlice'

export const useUpcoming = () => {
  const dispatch: AppDispatch = useDispatch()
  const { bills, isLoading, error, billContributions } = useSelector((state: RootState) => state.upcoming)

  const getUpcomingBills = useCallback(async () => {
    try {
      await dispatch(fetchUpcomingBillsAsync()).unwrap()
    } catch (error) {
      console.error('Failed to fetch upcoming bills:', error)
      throw error
    }
  }, [dispatch])

  const addUpcomingBill = useCallback(
    async (bill: AddBillForm) => {
      try {
        await dispatch(createUpcomingBillAsync(bill)).unwrap()
      } catch (error) {
        console.error('Failed to create upcoming bill:', error)
        throw error
      }
    },
    [dispatch]
  )

  const updateUpcomingBillInState = useCallback(
    async (bill: UpcomingBill) => {
      try {
        await dispatch(updateUpcomingBillAsync(bill)).unwrap()
      } catch (error) {
        console.error('Failed to update upcoming bill:', error)
        throw error
      }
    },
    [dispatch]
  )

  const removeUpcomingBill = useCallback(
    async (billId: string) => {
      try {
        await dispatch(deleteUpcomingBillAsync(billId)).unwrap()
      } catch (error) {
        console.error('Failed to delete upcoming bill:', error)
        throw error
      }
    },
    [dispatch]
  )

  const addBillContribution = useCallback(
    async (billContributions: AddBillContributionForm) => {
      try {
        await dispatch(addUpcomingBillContributionAsync(billContributions)).unwrap()
      } catch (error) {
        console.error('Failed to add bill contribution:', error)
        throw error
      }
    },
    [dispatch]
  )

  return {
    bills,
    isLoading,
    error,
    getUpcomingBills,
    addUpcomingBill,
    updateUpcomingBill: updateUpcomingBillInState,
    removeUpcomingBill,
    addBillContribution,
    billContributions
  }
}

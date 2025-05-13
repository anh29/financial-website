import { useAppSelector, useAppDispatch, AppDispatch } from '../store'
import { setUser, setLoading, setError, logout } from '../store/slices/authSlice'
import type { User } from '../types'
import { AnyAction } from '@reduxjs/toolkit'

// Utility function to handle dispatching loading and error states
const handleDispatch = <T>(dispatch: AppDispatch, action: (payload: T) => AnyAction, payload: T) => {
  dispatch(action(payload))
}

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, isLoading, error } = useAppSelector((state) => state.auth)

  const login = (user: User) => {
    handleDispatch(dispatch, setUser, user)
  }

  const logoutUser = () => {
    handleDispatch(dispatch, logout, null)
  }

  const setLoadingState = (loading: boolean) => {
    handleDispatch(dispatch, setLoading, loading)
  }

  const setErrorState = (error: string | null) => {
    handleDispatch(dispatch, setError, error)
  }

  return {
    user,
    isLoading,
    error,
    login,
    logout: logoutUser,
    setLoading: setLoadingState,
    setError: setErrorState
  }
}

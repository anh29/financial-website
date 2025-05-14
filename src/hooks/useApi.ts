import { useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (apiCall: () => Promise<T>, options?: UseApiOptions) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      options?.onSuccess?.()
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      options?.onError?.(errorMessage)
      throw error
    }
  }, [])

  return {
    ...state,
    execute
  }
}

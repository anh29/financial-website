import { useEffect, useRef } from 'react'

export const useDebouncedEffect = (callback: () => void, deps: any[], delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(callback, delay)
    return () => clearTimeout(timeoutRef.current as NodeJS.Timeout | undefined)
  }, deps)
}

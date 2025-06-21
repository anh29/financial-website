import { useState, useEffect } from 'react'

export function formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND'): string {
  return amount ? amount.toLocaleString(locale, { style: 'currency', currency }) : '0 VND'
}

export function formatDate(
  date: string | Date,
  locale = 'vi-VN',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, options)
}

export const getMonths = (startYear = 2023, endYear = 2026) => {
  const result: { value: string; label: string }[] = []
  for (let y = startYear; y <= endYear; y++) {
    for (let m = 1; m <= 12; m++) {
      const value = `${y}-${String(m).padStart(2, '0')}`
      const label = `Tháng ${m} năm ${y}`
      result.push({ value, label })
    }
  }
  return result
}

export const isMobileDevice = (): boolean => {
  return window.innerWidth <= 768
}

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

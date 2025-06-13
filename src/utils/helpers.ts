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

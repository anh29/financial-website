export interface Goals {
  id: string
  amount: number
  description: string
  target_date: string
  amortized_days: number
  created_at: string
  [key: string]: string | number
}

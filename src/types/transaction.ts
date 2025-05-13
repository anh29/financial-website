export interface Transaction {
  id: string
  date: string
  amount: number
  type: 'expense' | 'income'
  category: string
  description: string
  source: string
  is_amortized: boolean
  amortized_days?: number
  created_at?: string
  isClassifying?: boolean
  classificationError?: string
}

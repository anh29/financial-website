export interface LastPaidInfo {
  payment_date: string
  amount: number
  month_paid: string
}

export interface UpcomingBill {
  bill_id: string
  title: string
  amount: number
  category: string
  repeat_type: string
  due_date: string
  next_due_date: string
  paid_this_period: boolean
  payment_status: 'paid' | 'unpaid'
  is_overdue: boolean
  overdue_days: number | null
  days_until_due: number | null
  last_paid_info: LastPaidInfo | null
  total_paid_count: number
  months_left: number | null
  progress_ratio: number | null
  start_date: string
  end_date: string | null
}

export interface AddBillForm {
  title: string
  amount: number
  category: string
  frequency: string
  start_date: string
  end_date: string | null
  day_of_month: number
}

export interface UpcomingBillContribution {
  id: string
  bill_id: string
  month: string
  amount: number
  source?: string
}

export interface AddBillContributionForm {
  bill_id: string
  amount: number
  date_paid: string
  month_paid: string
}

import { UpcomingBill } from '../types/upcoming'

export interface Bill {
  date: {
    month: string
    day: number
  }
  description: string
  lastCharge: string
  amount: string
}

export interface GroupedBills {
  [key: string]: UpcomingBill[]
}

export const groupBillsByMonth = (bills: UpcomingBill[]): GroupedBills => {
  return bills.reduce((groups: GroupedBills, bill) => {
    const date = new Date(bill.start_date)
    const month = date.toLocaleString('default', { month: 'long' })

    if (!groups[month]) {
      groups[month] = []
    }

    groups[month].push(bill)
    return groups
  }, {})
}

export const calculateTotalAmount = (bills: UpcomingBill[]): number => {
  return bills.reduce((total, bill) => total + bill.amount, 0)
}

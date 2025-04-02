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
  [month: string]: Bill[]
}

export const groupBillsByMonth = (bills: Bill[]): GroupedBills => {
  return bills.reduce((acc: GroupedBills, bill: Bill) => {
    const { month } = bill.date
    if (!acc[month]) acc[month] = []
    acc[month].push(bill)
    return acc
  }, {})
}

export const calculateTotalAmount = (bills: Bill[]): string => {
  return bills.reduce((total, bill) => total + parseFloat(bill.amount.replace('$', '')), 0).toFixed(2)
}

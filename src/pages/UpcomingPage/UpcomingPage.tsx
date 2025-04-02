import { useState } from 'react'
import styles from './UpcomingPage.module.css'
import { calculateTotalAmount, groupBillsByMonth } from '../../utils/billUtils'
import BillDetails from './BillDetails/BillDetails'

const billsData = [
  {
    date: { month: 'May', day: 15 },
    description: 'Figma - Yearly Plan',
    lastCharge: '14 May, 2022',
    amount: '$150'
  },
  {
    date: { month: 'Jun', day: 16 },
    description: 'Adobe Inc - Yearly Plan',
    lastCharge: '17 Jun, 2022',
    amount: '$559'
  }
]

interface Bill {
  date: {
    month: string
    day: number
  }
  description: string
  lastCharge: string
  amount: string
}

const UpcomingPage = () => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  const handlePayNowClick = (bill: Bill) => {
    setSelectedBill(bill)
  }

  const handleCloseModal = () => {
    setSelectedBill(null)
  }

  const groupedBills = groupBillsByMonth(billsData)

  return (
    <div className={styles.upcomingPage}>
      <header className={styles.header}>
        <h1>Upcoming Bills</h1>
        <p>Keep track of your upcoming payments and never miss a due date.</p>
      </header>
      <div className={styles.billsContainer}>
        {Object.keys(groupedBills).map((month) => (
          <section key={month} className={styles.monthSection}>
            <h2 className={styles.monthTitle}>{month}</h2>
            <table className={styles.billsTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Last Charge</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedBills[month].map((bill, index) => (
                  <tr key={index} className={styles.billRow}>
                    <td className={styles.dateCell}>
                      <p>{bill.date.day}</p>
                    </td>
                    <td className={styles.descriptionCell}>
                      <p className={styles.description}>{bill.description}</p>
                    </td>
                    <td className={styles.lastChargeCell}>
                      <p>{bill.lastCharge}</p>
                    </td>
                    <td className={styles.amountCell}>
                      <p>{bill.amount}</p>
                    </td>
                    <td className={styles.actionCell}>
                      <button className={styles.payNowButton} onClick={() => handlePayNowClick(bill)}>
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className={styles.totalLabel}>
                    Total Amount:
                  </td>
                  <td className={styles.totalAmount}>${calculateTotalAmount(groupedBills[month])}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </section>
        ))}
      </div>
      {selectedBill && <BillDetails selectedBill={selectedBill} handleCloseModal={handleCloseModal} />}
    </div>
  )
}

export default UpcomingPage

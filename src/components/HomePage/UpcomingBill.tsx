import React from 'react'
import styles from './UpcomingBill.module.css'

const billsData = [
  {
    date: { month: 'May', day: 15 },
    details: { name: 'Figma', duration: 'Monthly', lastCharge: '14 May, 2022' },
    amount: '$150'
  },
  {
    date: { month: 'Jun', day: 16 },
    details: { name: 'Adobe', duration: 'Yearly', lastCharge: '17 Jun, 2023' },
    amount: '$559'
  }
]

const UpcomingBill = () => {
  return (
    <div className={styles.upcomingBill}>
      <h2>Upcoming Bill</h2>
      {billsData.map((bill, index) => (
        <div key={index} className={styles.bill}>
          <div className={styles.date}>
            <p>{bill.date.month}</p>
            <p>{bill.date.day}</p>
          </div>
          <div className={styles.details}>
            <p>
              {bill.details.name} - {bill.details.duration}
            </p>
            <p>Last Charge - {bill.details.lastCharge}</p>
          </div>
          <div className={styles.amount}>
            <p>{bill.amount}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UpcomingBill

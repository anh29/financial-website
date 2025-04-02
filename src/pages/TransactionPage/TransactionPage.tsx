import React, { useState } from 'react'
import styles from './TransactionPage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faTshirt, faUtensils, faTicketAlt, faTaxi, faPizzaSlice, faKeyboard } from '@fortawesome/free-solid-svg-icons'

const transactionsData = [
  { icon: faGamepad, item: 'GTR 5', shop: 'Gadget & Gear', date: '17 May, 2023', method: 'Credit Card', amount: '$160.00' },
  { icon: faTshirt, item: 'Polo shirt', shop: 'XL fashions', date: '17 May, 2023', method: 'Credit Card', amount: '$20.00' },
  { icon: faUtensils, item: 'Biriyani', shop: 'Hajir Biriyani', date: '17 May, 2023', method: 'Credit Card', amount: '$12.00' },
  { icon: faTicketAlt, item: 'Movie ticket', shop: 'Inox', date: '17 May, 2023', method: 'Credit Card', amount: '$15.00' },
  { icon: faTaxi, item: 'Taxi fare', shop: 'Uber', date: '17 May, 2023', method: 'Credit Card', amount: '$10.00' },
  { icon: faPizzaSlice, item: 'Pizza', shop: 'Pizza Hit', date: '17 May, 2023', method: 'Credit Card', amount: '$20.00' },
  { icon: faKeyboard, item: 'Keyboard', shop: 'Gadget & Gear', date: '17 May, 2023', method: 'Credit Card', amount: '$30.00' }
]

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState('all')

  const filteredTransactions = transactionsData.filter((transaction) =>
    activeTab === 'all' ? true : activeTab === transaction.method.toLowerCase()
  )

  return (
    <div className={styles.transactionPage}>
      <h1>Recent Transaction</h1>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`} onClick={() => setActiveTab('all')}>
          All
        </button>
        <button className={`${styles.tab} ${activeTab === 'revenue' ? styles.active : ''}`} onClick={() => setActiveTab('revenue')}>
          Revenue
        </button>
        <button className={`${styles.tab} ${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}>
          Expenses
        </button>
      </div>
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th>Items</th>
            <th>Shop Name</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>
                <FontAwesomeIcon icon={transaction.icon} className={styles.icon} /> {transaction.item}
              </td>
              <td>{transaction.shop}</td>
              <td>{transaction.date}</td>
              <td>{transaction.method}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.loadMore}>Load More</button>
    </div>
  )
}

export default TransactionPage

import React, { useState } from 'react'
import styles from './RecentTransaction.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faTshirt, faUtensils, faTaxi, faKeyboard } from '@fortawesome/free-solid-svg-icons'

const transactionsData = [
  { icon: faGamepad, name: 'GTR 5', category: 'Gadget & Gear', amount: '$160.00', date: '17 May 2023', type: 'all' },
  { icon: faTshirt, name: 'Polo Shirt', category: 'XL fashions', amount: '$20.00', date: '17 May 2023', type: 'revenue' },
  { icon: faUtensils, name: 'Biriyani', category: 'Hajir Biriyani', amount: '$10.00', date: '17 May 2023', type: 'expense' },
  { icon: faTaxi, name: 'Taxi Fare', category: 'Uber', amount: '$12.00', date: '17 May 2023', type: 'expense' },
  { icon: faKeyboard, name: 'Keyboard', category: 'Gadget & Gear', amount: '$22.00', date: '17 May 2023', type: 'revenue' }
]

const RecentTransaction = () => {
  const [activeTab, setActiveTab] = useState('all')

  const filteredTransactions = transactionsData.filter(transaction => 
    activeTab === 'all' || transaction.type === activeTab
  )

  return (
    <div className={styles.recentTransaction}>
      <h2>Recent Transaction</h2>
      <div className={styles.tabs}>
        <div className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`} onClick={() => setActiveTab('all')}>All</div>
        <div className={`${styles.tab} ${activeTab === 'revenue' ? styles.active : ''}`} onClick={() => setActiveTab('revenue')}>Revenue</div>
        <div className={`${styles.tab} ${activeTab === 'expense' ? styles.active : ''}`} onClick={() => setActiveTab('expense')}>Expenses</div>
      </div>
      <ul>
        {filteredTransactions.map((transaction, index) => (
          <li key={index}>
            <div className={styles.icon}>
              <FontAwesomeIcon icon={transaction.icon} />
            </div>
            <div className={styles.information}>
              <p>{transaction.name}</p>
              <p>{transaction.category}</p>
            </div>
            <div className={styles.details}>
              <p>{transaction.amount}</p>
              <p>{transaction.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentTransaction

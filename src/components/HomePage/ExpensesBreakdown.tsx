import React from 'react'
import styles from './ExpensesBreakdown.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUp,
  faArrowDown,
  faHouse,
  faUtensils,
  faBus,
  faFilm,
  faShoppingBag,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons/faArrowCircleRight'

const expensesData = [
  { category: 'Housing', amount: 250.0, change: 15, icon: faHouse, direction: 'up' },
  { category: 'Food', amount: 350.0, change: -8, icon: faUtensils, direction: 'down' },
  { category: 'Transportation', amount: 50.0, change: -12, icon: faBus, direction: 'down' },
  { category: 'Entertainment', amount: 80.0, change: 15, icon: faFilm, direction: 'up' },
  { category: 'Shopping', amount: 420.0, change: 25, icon: faShoppingBag, direction: 'up' },
  { category: 'Others', amount: 650.0, change: 23, icon: faEllipsisH, direction: 'up' }
]

const ExpensesBreakdown = () => {
  return (
    <div className={styles.expensesContainer}>
      <h2>Expenses Breakdown</h2>
      <p className={styles.expenseNote}>Compare to last month</p>
      <div className={styles.expensesBreakdown}>
        {expensesData.map((expense, index) => (
          <div key={index} className={styles.expense}>
            <div className={styles.expenseContent}>
              <div className={styles.expenseIconContainer}>
                <FontAwesomeIcon icon={expense.icon} className={styles.expenseIcon} />
              </div>
              <div className={styles.expenseDetails}>
                <p>{expense.category}</p>
                <p className={styles.expenseAmount}>${expense.amount.toFixed(2)}</p>
                <div className={`${styles.expenseChange} ${styles[expense.direction]}`}>
                  <p>
                    {Math.abs(expense.change)}% <span>*</span>
                  </p>
                  <FontAwesomeIcon icon={expense.direction === 'up' ? faArrowUp : faArrowDown} />
                </div>
              </div>
            </div>
            <a href='#'>
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpensesBreakdown

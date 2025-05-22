import React from 'react'
import { Modal } from '../common'
import styles from './DayDetailModal.module.css'
import { Transaction } from '../../types/transaction'
import { categoryColors, expenseCategories } from '../../utils/categoryUtils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
interface DayDetailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDay: number | null
  calendarMonth: number
  calendarYear: number
  dayExpenses: Transaction[]
  monthNames: string[]
  handleAddExpense: () => void
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  calendarMonth,
  calendarYear,
  dayExpenses,
  monthNames,
  handleAddExpense
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='small'>
      <div className={styles.dayDetailModal}>
        <div className={styles.dayDetailHeader}>
          <h3>
            {monthNames[calendarMonth]} {selectedDay}, {calendarYear}
          </h3>
          <div className={styles.totalAmount}>
            {dayExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} VND
            <span>total spent</span>
          </div>
        </div>

        <div className={styles.expensesList}>
          {dayExpenses.length === 0 ? (
            <div className={styles.noExpenses}>
              <span className={styles.emptyIcon}>💰</span>
              <p>No expenses recorded for this day.</p>
              <button className={styles.addButton} onClick={handleAddExpense}>
                Add Expense
              </button>
            </div>
          ) : (
            <>
              {dayExpenses.map((e) => (
                <div key={e.id} className={styles.expenseItem}>
                  <div className={styles.expenseIcon}>
                    <FontAwesomeIcon
                      icon={expenseCategories.find((c) => c.label === e.category)?.icon || faCircle}
                      style={{ color: categoryColors[e.category] }}
                    />
                  </div>
                  <div className={styles.expenseInfo}>
                    <div className={styles.expenseDetails}>{e.description}</div>
                    <div className={styles.expenseTags}>
                      <span key={e.category} className={styles.tag}>
                        {e.category}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`${styles.expenseAmount} ${
                      e.amount < 50000 ? styles.low : e.amount < 150000 ? styles.medium : styles.high
                    }`}
                  >
                    {e.amount.toLocaleString()} VND
                  </div>
                </div>
              ))}

              <div className={styles.dayStats}>
                <div className={styles.statItem}>
                  <span>Average per transaction</span>
                  <strong>
                    {(dayExpenses.reduce((sum, e) => sum + e.amount, 0) / dayExpenses.length).toLocaleString()} VND
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <span>Number of transactions</span>
                  <strong>{dayExpenses.length}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default DayDetailModal

import React from 'react'
import { Modal } from '../common'
import styles from './DayDetailModal.module.css'
import { Transaction } from '../../types/transaction'
import { categoryColors, expenseCategories } from '../../utils/categoryUtils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

interface DayDetailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDay: number | null
  calendarMonth: number
  calendarYear: number
  dayExpenses: (Transaction & { totalAmount?: number })[]
  handleAddExpense: () => void
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  calendarMonth,
  calendarYear,
  dayExpenses,
  handleAddExpense
}) => {
  const sortedExpenses = [...dayExpenses].sort((a, b) => b.amount - a.amount)

  const dayStr = selectedDay?.toString().padStart(2, '0')
  const monthStr = (calendarMonth + 1).toString().padStart(2, '0')
  const dateDisplay = `${dayStr} Tháng ${monthStr}, ${calendarYear}`

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='small' title='Chi tiết ngày'>
      <div className={styles.dayDetailModal}>
        <div className={styles.dayDetailHeader}>
          <h3>{dateDisplay}</h3>
          <div className={styles.totalAmount}>
            {dayExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('vi-VN')}đ <span>tổng chi tiêu</span>
          </div>
          <div className={styles.dayStats}>
            <p>
              {dayExpenses.length} <span>chi tiêu</span>
            </p>
          </div>
        </div>

        <div className={styles.expensesList}>
          {dayExpenses.length === 0 ? (
            <div className={styles.noExpenses}>
              <span className={styles.emptyIcon}>💰</span>
              <p>Không có chi tiêu nào được ghi nhận cho ngày này.</p>
              <button className={styles.addButton} onClick={handleAddExpense}>
                Thêm chi tiêu
              </button>
            </div>
          ) : (
            <>
              {sortedExpenses.map((e) => (
                <div key={e.id} className={styles.expenseItem}>
                  <div className={styles.expenseIcon}>
                    <FontAwesomeIcon
                      icon={expenseCategories.find((c) => c.label === e.category)?.icon || faCircle}
                      style={{ color: categoryColors[e.category] }}
                    />
                  </div>
                  <div className={styles.expenseContainer}>
                    <div className={styles.expenseContent}>
                      <div className={styles.expenseInfo}>
                        <div className={styles.expenseDetails}>{e.description}</div>
                        <div className={styles.expenseTags}>
                          <span key={e.category} className={styles.tag}>
                            {e.category}
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          styles.expenseAmount +
                          ' ' +
                          (e.amount < 50000 ? styles.low : e.amount < 150000 ? styles.medium : styles.high)
                        }
                      >
                        {e.amount.toLocaleString('vi-VN')} đ
                        {e.is_amortized && e.totalAmount && (
                          <FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />
                        )}
                      </div>
                    </div>

                    {e.is_amortized && e.totalAmount && (
                      <div className={styles.amortizedDetailBox}>
                        {e.totalAmount.toLocaleString('vi-VN')} đ, phân bổ {e.amortized_days} ngày
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default DayDetailModal

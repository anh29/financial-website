import React from 'react'
import styles from './ExpensesBreakdown.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faBus, faEllipsisH, faFilm, faHouse, faShoppingBag, faUtensils } from '@fortawesome/free-solid-svg-icons'

const iconMap = {
  Housing: faHouse,
  Food: faUtensils,
  Transportation: faBus,
  Entertainment: faFilm,
  Shopping: faShoppingBag,
  Others: faEllipsisH
}

const ExpensesBreakdown = ({ expensesData, selectedExpense, setSelectedExpense }) => {
  const handleCardClick = (expense) => {
    setSelectedExpense(expense)
  }

  const closeModal = () => {
    setSelectedExpense(null)
  }

  return (
    <section className={styles.expensesBreakdown}>
      <h2>Expenses Breakdown</h2>
      <div className={styles.cards}>
        {expensesData.map((expense, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleCardClick(expense)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={iconMap[expense.category]} className={styles.icon} />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.category}>{expense.category}</h3>
                <p className={styles.amount}>${expense.amount.toFixed(2)}</p>
              </div>
              <div className={styles.change}>
                <span className={expense.direction === 'up' ? styles.up : styles.down}>
                  {expense.change}% <FontAwesomeIcon icon={expense.direction === 'up' ? faArrowUp : faArrowDown} />
                </span>
                <span>Compare to last month</span>
              </div>
            </div>
            <ul className={styles.details}>
              {expense.details.slice(-2).map((detail, idx) => (
                <li key={idx}>
                  {detail.split(':')[0]} <span>{detail.split(':')[1]}</span>
                </li>
              ))}
            </ul>
            <button className={styles.viewDetailsButton} onClick={() => handleCardClick(expense)}>
              View Details
            </button>
          </div>
        ))}
      </div>
      {selectedExpense && (
        <>
          <div className={styles.modalBackdrop} onClick={closeModal}></div>
          <div
            className={styles.modal}
            role='dialog'
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
          >
            <div className={styles.modalHeader}>
              <h2 id='modal-title'>{selectedExpense.category} Details</h2>
              <button className={styles.modalCloseButton} onClick={closeModal} aria-label='Close'>
                &times;
              </button>
            </div>
            <div className={styles.modalContent} id='modal-description'>
              <p className={styles.modalTotal}>
                <strong>Total Amount:</strong> ${selectedExpense.amount.toFixed(2)}
              </p>
              <ul className={styles.modalDetailsList}>
                {selectedExpense.details.map((detail, idx) => (
                  <li key={idx} className={styles.modalDetailItem}>
                    {detail.split(':')[0]} <span>{detail.split(':')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default ExpensesBreakdown

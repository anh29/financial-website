import React from 'react'
import styles from './BillDetails.module.css'
import { UpcomingBill } from '../../types/upcoming'

interface BillDetailsProps {
  selectedBill: UpcomingBill
  handleCloseModal: () => void
}

const BillDetails: React.FC<BillDetailsProps> = ({ selectedBill, handleCloseModal }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment submission
    handleCloseModal()
  }

  return (
    <div className={styles.billDetailsModal} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Bill Details</h2>
        <div className={styles.billInfo}>
          <div className={styles.infoRow}>
            <span>Title:</span>
            <span>{selectedBill.title}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Amount:</span>
            <span>${selectedBill.amount.toLocaleString()}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Category:</span>
            <span>{selectedBill.category}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Frequency:</span>
            <span>{selectedBill.repeat_type}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Start Date:</span>
            <span>{selectedBill.start_date ? new Date(selectedBill.start_date).toLocaleDateString() : ''}</span>
          </div>
          <div className={styles.infoRow}>
            <span>End Date:</span>
            <span>{selectedBill.end_date ? new Date(selectedBill.end_date).toLocaleDateString() : ''}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Day of Month:</span>
            <span>{selectedBill.due_date}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Status:</span>
            <span className={styles[selectedBill.payment_status]}>{selectedBill.payment_status}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.paymentForm}>
          <button type='submit' className={styles.payButton}>
            Confirm Payment
          </button>
          <button type='button' className={styles.cancelButton} onClick={handleCloseModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default BillDetails

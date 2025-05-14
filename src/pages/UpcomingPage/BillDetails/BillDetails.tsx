import React from 'react'
import styles from './BillDetails.module.css'
import { Bill } from '../../../utils/billUtils'
import { Modal } from '../../../components/common'

interface BillDetailsProps {
  selectedBill: Bill
  handleCloseModal: () => void
}

const BillDetails: React.FC<BillDetailsProps> = ({ selectedBill, handleCloseModal }) => {
  return (
    <Modal isOpen={true} onClose={handleCloseModal} title='Confirm Payment'>
      <div className={styles.billDetails}>
        <p className={styles.billDescription}>
          <strong>Description:</strong> {selectedBill.description}
        </p>
        <p className={styles.billAmount}>
          <strong>Amount:</strong> {selectedBill.amount}
        </p>
        <p className={styles.billLastCharge}>
          <strong>Last Charge:</strong> {selectedBill.lastCharge}
        </p>
      </div>
      <p className={styles.confirmText}>Do you want to proceed with this payment?</p>
      <div className={styles.modalActions}>
        <button className={styles.confirmButton} onClick={handleCloseModal}>
          Confirm
        </button>
      </div>
    </Modal>
  )
}

export default BillDetails

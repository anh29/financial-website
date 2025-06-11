import React from 'react'
import styles from './BillDetails.module.css'
import { UpcomingBill } from '../../types/upcoming'
import { formatDate } from '../../utils/helpers'

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
        <h2>Chi tiết hóa đơn</h2>
        <div className={styles.billInfo}>
          <div className={styles.infoRow}>
            <span>Tiêu đề:</span>
            <span>{selectedBill.title}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Số tiền:</span>
            <span>{selectedBill.amount.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className={styles.infoRow}>
            <span>Danh mục:</span>
            <span>{selectedBill.category}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Tần suất:</span>
            <span>
              {selectedBill.repeat_type === 'monthly'
                ? 'Hàng tháng'
                : selectedBill.repeat_type === 'quarterly'
                  ? 'Hàng quý'
                  : selectedBill.repeat_type}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span>Ngày bắt đầu:</span>
            <span>{selectedBill.start_date ? formatDate(selectedBill.start_date) : ''}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Ngày kết thúc:</span>
            <span>{selectedBill.end_date ? formatDate(selectedBill.end_date) : ''}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Ngày thanh toán:</span>
            <span>{selectedBill.due_date}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Trạng thái:</span>
            <span className={styles[selectedBill.payment_status]}>
              {selectedBill.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.paymentForm}>
          <button type='submit' className={styles.payButton}>
            Xác nhận thanh toán
          </button>
          <button type='button' className={styles.cancelButton} onClick={handleCloseModal}>
            Hủy
          </button>
        </form>
      </div>
    </div>
  )
}

export default BillDetails

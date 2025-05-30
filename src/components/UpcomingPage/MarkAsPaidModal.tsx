import React, { useEffect, useState } from 'react'
import styles from './MarkAsPaidModal.module.css'
import { AddBillContributionForm } from '../../types/upcoming'

type BillContributionInfo = AddBillContributionForm & {
  name: string
}

interface MarkAsPaidModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: AddBillContributionForm) => void
  bill: BillContributionInfo
}

const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({ isOpen, onClose, onConfirm, bill }) => {
  const [amount, setAmount] = useState(bill.amount)
  const [datePaid, setDatePaid] = useState(bill.date_paid)
  const [monthPaid, setMonthPaid] = useState(bill.month_paid)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setAmount(bill.amount)
    setDatePaid(bill.date_paid)
    setMonthPaid(bill.month_paid)
  }, [bill])
  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    onConfirm({ bill_id: bill.bill_id, amount, date_paid: datePaid, month_paid: monthPaid })
    setIsSubmitting(false)
  }

  return (
    <div className={styles.markAsPaidModalContainer}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Xác nhận thanh toán {bill.name}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Số tiền
            <input type='number' value={amount} onChange={(e) => setAmount(Number(e.target.value))} required min={0} />
          </label>
          <label className={styles.formLabel}>
            Ngày thanh toán
            <input type='date' value={datePaid} onChange={(e) => setDatePaid(e.target.value)} required />
          </label>
          <label className={styles.formLabel}>
            Tháng thanh toán
            <input
              type='month'
              value={monthPaid && new Date(monthPaid).toISOString().slice(0, 7)}
              onChange={(e) => setMonthPaid(e.target.value)}
              required
            />
          </label>
          <div className={styles.actionsRow}>
            <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
            </button>
            <button type='button' className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MarkAsPaidModal

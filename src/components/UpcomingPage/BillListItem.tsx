import React from 'react'
import styles from './BillListItem.module.css'
import { UpcomingBill } from '../../types/upcoming'
import { getCategoryInfo, categoryColors } from '../../utils/categoryUtils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faCalendarAlt, faExclamationTriangle, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '../../utils/helpers'

interface BillListItemProps {
  bill: UpcomingBill
  getStatusBadge: (bill: UpcomingBill) => React.ReactNode
  getCategoryBadge: (category: string) => React.ReactNode
  onMarkAsPaid: (bill: UpcomingBill) => void
}

const BillListItem: React.FC<BillListItemProps> = ({ bill, getStatusBadge, getCategoryBadge, onMarkAsPaid }) => {
  const categoryInfo = getCategoryInfo(bill.category)
  const icon = categoryInfo ? (
    <FontAwesomeIcon icon={categoryInfo.icon} size='lg' />
  ) : (
    <FontAwesomeIcon icon={faQuestionCircle} size='lg' />
  )
  const bg = categoryColors[bill.category] || '#a0aec0'
  const cardClass = `${styles.upcomingBillCard} ${bill.is_overdue ? styles.billCardOverdue : bill.payment_status === 'paid' ? styles.billCardPaid : bill.payment_status === 'unpaid' ? styles.billCardUnpaid : ''}`

  // Progress bar calculation
  let progressRatio = 0
  let progressText = ''
  if (typeof bill.progress_ratio === 'number' && bill.months_left !== null) {
    const totalMonths = 13
    const paidMonths = totalMonths - bill.months_left
    progressRatio = paidMonths / totalMonths
    progressText = `${paidMonths}/${totalMonths} tháng (còn ${bill.months_left} tháng)`
  }

  const isOverdue = bill.is_overdue && bill.overdue_days !== null

  return (
    <div className={cardClass}>
      <div className={styles.billCardContent}>
        {/* Left: Icon */}
        <div className={styles.billIcon} style={{ background: bg }}>
          {icon}
        </div>
        {/* Center: Info */}
        <div className={styles.billInfoSection}>
          <div className={styles.billTitleRow}>
            <span className={styles.billTitle}>{bill.title}</span>
            {getStatusBadge(bill)}
            {getCategoryBadge(bill.category)}
          </div>
          <div className={styles.billMetaRow}>
            <span className={styles.billMeta}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 4 }} color='#4f8cff' />
              {bill.repeat_type === 'monthly'
                ? 'Hàng tháng'
                : bill.repeat_type === 'quarterly'
                  ? 'Hàng quý'
                  : bill.repeat_type}
            </span>
            {bill.is_overdue && bill.overdue_days !== null && (
              <span className={styles.billMeta}>
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 4 }} color='#ff5c5c' /> Quá hạn{' '}
                {bill.overdue_days} ngày
              </span>
            )}
            <span className={styles.billMeta}>
              <FontAwesomeIcon icon={faReceipt} style={{ marginRight: 4 }} color='#888' />
              Đã trả {bill.total_paid_count} lần
            </span>
          </div>
          {/* Progress bar and label */}
          {typeof bill.progress_ratio === 'number' && bill.months_left !== null && (
            <>
              <div className={styles.progressLabel}>Tiến độ thanh toán</div>
              <div className={styles.progressBarRow}>
                <div className={styles.progressBar}>
                  <div className={styles.progressBarFill} style={{ width: `${progressRatio * 100}%` }} />
                </div>
                <div className={styles.progressBarText}>{progressText}</div>
              </div>
            </>
          )}
        </div>
        {/* Right: Amount, Due, Button, Menu */}
        <div className={styles.billRightSection}>
          <div className={styles.billAmount}>{formatCurrency(bill.amount)}</div>
          <div className={styles.billDueDate}>Kỳ tới: {isOverdue ? bill.next_due_date : bill.due_date}</div>
          {bill.payment_status !== 'paid' && (
            <div className={styles.billDueDate}>
              {isOverdue && <p>Kỳ cần thanh toán: {bill.due_date}</p>}
              <button className={styles.markPaidButton} onClick={() => onMarkAsPaid(bill)}>
                <span className={styles.markPaidIcon}></span> Đánh dấu đã trả
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Overdue warning: full width below card content */}
      {isOverdue && (
        <div className={styles.overdueWarningFull}>
          <i className='fa fa-exclamation-triangle' /> Hóa đơn này đã quá hạn {bill.overdue_days} ngày. Vui lòng thanh
          toán sớm để tránh phí phạt.
        </div>
      )}
    </div>
  )
}

export default BillListItem

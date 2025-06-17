import { FiSmile } from 'react-icons/fi'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  type?: 'default' | 'cancelled'
}

export const EmptyState = ({ type = 'default' }: EmptyStateProps) => {
  if (type === 'cancelled') {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.cancelledHappyState}>
          <FiSmile size={36} />
          <h2>Không có mục tiêu nào bị hủy!</h2>
          <p>Tiếp tục phát huy! 🎉</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateNoImg}>
        <h2>Chưa có mục tiêu nào</h2>
        <p>Bắt đầu bằng cách thêm mục tiêu tài chính đầu tiên của bạn!</p>
      </div>
    </div>
  )
}

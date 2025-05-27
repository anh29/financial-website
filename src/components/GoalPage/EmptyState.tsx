import { FiPlus, FiSmile } from 'react-icons/fi'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  onAdd: () => void
  type?: 'default' | 'cancelled'
}

export const EmptyState = ({ onAdd, type = 'default' }: EmptyStateProps) => {
  if (type === 'cancelled') {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.cancelledHappyState}>
          <FiSmile size={36} />
          <h2>No cancelled goals!</h2>
          <p>Keep up the great work! 🎉</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateNoImg}>
        <h2>No goals yet</h2>
        <p>Start by adding your first financial goal!</p>
        <button className={styles.addGoalBtn} onClick={onAdd}>
          <FiPlus /> Add New Goal
        </button>
      </div>
    </div>
  )
}

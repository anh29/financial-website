import { FiPlus } from 'react-icons/fi'
import styles from './FloatingActionButton.module.css'

interface FloatingActionButtonProps {
  onClick: () => void
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <div className={styles.fabContainer}>
      <button className={styles.fab} onClick={onClick}>
        <FiPlus />
      </button>
    </div>
  )
}

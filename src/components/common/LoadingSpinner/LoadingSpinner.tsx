import styles from './LoadingSpinner.module.css'

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={`${styles.loader} ${className || ''}`}>
      <span></span>
    </div>
  )
}

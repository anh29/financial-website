import styles from './StatusTabs.module.css'

interface StatusTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const StatusTabs = ({ activeTab, onTabChange }: StatusTabsProps) => {
  return (
    <div className={styles.statusTabsContainer}>
      <button
        className={activeTab === 'active' ? styles.statusTabActive : styles.statusTab}
        onClick={() => onTabChange('active')}
      >
        Active
      </button>
      <button
        className={activeTab === 'completed' ? styles.statusTabActive : styles.statusTab}
        onClick={() => onTabChange('completed')}
      >
        Completed
      </button>
      <button
        className={activeTab === 'cancelled' ? styles.statusTabActive : styles.statusTab}
        onClick={() => onTabChange('cancelled')}
      >
        Cancelled
      </button>
    </div>
  )
}

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
        Đang thực hiện
      </button>
      <button
        className={activeTab === 'completed' ? styles.statusTabActive : styles.statusTab}
        onClick={() => onTabChange('completed')}
      >
        Hoàn thành
      </button>
      <button
        className={activeTab === 'cancelled' ? styles.statusTabActive : styles.statusTab}
        onClick={() => onTabChange('cancelled')}
      >
        Đã hủy
      </button>
    </div>
  )
}

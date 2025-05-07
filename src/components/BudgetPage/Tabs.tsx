import React from 'react'
import styles from './Tabs.module.css'

interface TabsProps {
  activeTab: string
  setActiveTab: (tab: 'setup' | 'existing' | 'history' | 'overview' | 'comparison') => void
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === 'setup' ? styles.active : ''}`}
        onClick={() => setActiveTab('setup')}
      >
        Thiết lập & phân bổ
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'existing' ? styles.active : ''}`}
        onClick={() => setActiveTab('existing')}
      >
        Ngân sách hiện có
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
        onClick={() => setActiveTab('history')}
      >
        Lịch sử ngân sách
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        Tổng quan & Phân tích
      </button>
    </div>
  )
}

export default Tabs

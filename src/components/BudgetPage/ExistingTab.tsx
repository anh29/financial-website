import React from 'react'
import styles from './ExistingTab.module.css'

interface ExistingTabProps {
  existingBudgets: { category: string; amount: number }[]
  handleExistingChange: (index: number, field: string, value: string | number) => void
  handleAddExisting: () => void
}

const ExistingTab: React.FC<ExistingTabProps> = ({ existingBudgets, handleExistingChange, handleAddExisting }) => {
  return (
    <div className={styles.existingTab}>
      <h3 className={styles.sectionTitle}>💼 Ngân sách hiện có (ngoài giao dịch)</h3>
      {existingBudgets.map((item, index) => (
        <div key={index} className={styles.allocationRow}>
          <input
            type='text'
            placeholder='Tên khoản (VD: Quỹ dự phòng)'
            value={item.category}
            onChange={(e) => handleExistingChange(index, 'category', e.target.value)}
          />
          <input
            type='number'
            placeholder='Số tiền (đ)'
            value={item.amount}
            onChange={(e) => handleExistingChange(index, 'amount', e.target.value)}
          />
        </div>
      ))}
      <button className={styles.addButton} onClick={handleAddExisting}>
        + Thêm khoản ngân sách
      </button>
    </div>
  )
}

export default ExistingTab

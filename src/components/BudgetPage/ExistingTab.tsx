import React, { useState, useEffect } from 'react'
import styles from './ExistingTab.module.css'
import { Budget } from '../../types/budgets'

interface ExistingTabProps {
  income: Budget | null
  existingBudgets: Budget[]
}

// Simple category mapping for demo
const getCategoryClassAndIcon = (desc: string) => {
  const d = desc.toLowerCase()
  if (d.includes('tích lũy') || d.includes('tiết kiệm') || d.includes('quỹ'))
    return { cls: styles['budgetCard--savings'], icon: '💰' }
  if (d.includes('ăn') || d.includes('uống') || d.includes('food'))
    return { cls: styles['budgetCard--food'], icon: '🍔' }
  if (d.includes('đầu tư') || d.includes('investment')) return { cls: styles['budgetCard--investment'], icon: '📈' }
  if (d.includes('nợ') || d.includes('cọc')) return { cls: styles['budgetCard--debt'], icon: '💸' }
  return { cls: styles['budgetCard--other'], icon: '🗂️' }
}

const ExistingTab: React.FC<ExistingTabProps> = ({ income, existingBudgets }) => {
  const incomeAndBudgets = income ? [income, ...existingBudgets] : existingBudgets
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    // Trigger animation after component mount
    setAnimateCards(true)
  }, [])

  // --- UI rendering ---
  // Total budget calculation
  const totalBudget = incomeAndBudgets.reduce((sum, b) => sum + (b.amount || 0), 0)

  const renderBudgets = (budget: Budget[]) => {
    return (
      <div className={styles.budgetList}>
        {budget.map((item, index) => {
          if (index === 0 && income) return null // skip income, shown in total card
          const { cls, icon } = getCategoryClassAndIcon(item.description)
          return (
            <div
              key={index}
              className={`${styles.budgetCard} ${cls} ${animateCards ? styles.animate : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.budgetIcon}>{icon}</div>
              <div className={styles.budgetInfo}>
                <div className={styles.budgetName}>{item.description}</div>
                <div className={styles.budgetAmount}>{item.amount.toLocaleString()} đ</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.existingTab}>
      {/* Header */}
      <h3 className={styles.sectionTitle}>Ngân sách hiện có</h3>

      {/* Total budget card */}
      <div className={styles.totalBudgetCard}>
        <span className={styles.totalBudgetIcon}>💰</span>
        <div className={styles.totalBudgetInfo}>
          <span className={styles.totalBudgetLabel}>Tổng ngân sách</span>
          <span className={styles['budgetAmount--large']}>{totalBudget.toLocaleString()} đ</span>
        </div>
      </div>

      {/* Existing Budgets Section */}
      <div className={styles.section}>
        <h4 className={styles.subSectionTitle}>📂 Danh sách ngân sách hiện có</h4>
        {incomeAndBudgets.length > 0 ? (
          renderBudgets(incomeAndBudgets)
        ) : (
          <p className={styles.emptyMessage}>Chưa có ngân sách nào được tạo.</p>
        )}
      </div>
    </div>
  )
}

export default ExistingTab

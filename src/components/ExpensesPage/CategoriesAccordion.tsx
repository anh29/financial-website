import React from 'react'
import styles from './CategoriesAccordion.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

type Expense = {
  id: string
  category: string
  amount: number
  date: string
  details: string
  tags: string[]
  note: string
}

type Props = {
  groupedExpenses: { [date: string]: Expense[] }
}

const CategoriesAccordion: React.FC<Props> = ({ groupedExpenses }) => (
  <div className={styles.accordionGroup}>
    {Object.entries(groupedExpenses).map(([date, expenses]) => (
      <div key={date} className={styles.categoryCard}>
        <div className={styles.accordionHeader}>
          <span className={styles.categoryTitle}>
            <FontAwesomeIcon icon={faFolderOpen} /> {date}
          </span>
          <span className={styles.categoryTotal}>Total: ${expenses.reduce((sum, e) => sum + e.amount, 0)}</span>
        </div>
        <div className={styles.accordionBody}>
          <div className={styles.categoryMiniChart}>{/* TODO: Mini bar/pie for this category/date */}</div>
          <div className={styles.categoryList}>
            {expenses.map((e) => (
              <div className={styles.expenseItem} key={e.id}>
                <div className={styles.expenseTitle}>
                  {e.details} <span style={{ fontWeight: 600 }}>${e.amount}</span>
                </div>
                <div className={styles.expenseMeta}>
                  {e.category} | {e.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default CategoriesAccordion

// ChartCard.tsx (no changes)
import React from 'react'
import styles from './ChartCard.module.css'

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <div className={styles.content}>{children}</div>
  </div>
)

export default ChartCard

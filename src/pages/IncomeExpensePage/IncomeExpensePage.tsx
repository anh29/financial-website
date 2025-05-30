import React, { useState } from 'react'
import IncomeExpenseForm from '../../components/IncomeExpense/IncomeExpenseForm'
import styles from './IncomeExpensePage.module.css'

const IncomeExpensePage = () => {
  const [transactions, setTransactions] = useState<{ type: string; amount: number; description: string }[]>([])

  const handleAddTransaction = (transaction: { type: string; amount: number; description: string }) => {
    setTransactions([...transactions, transaction])
  }

  return (
    <div className={styles.incomeExpensePage}>
      <h1>Quản Lý Thu Chi</h1>
      <IncomeExpenseForm onAdd={handleAddTransaction} />
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.type}: {transaction.amount.toLocaleString('vi-VN')} VND - {transaction.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IncomeExpensePage

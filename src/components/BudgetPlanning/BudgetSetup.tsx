import React, { useState } from 'react'
import styles from './BudgetSetup.module.css'

const BudgetSetup = () => {
  const [budgets, setBudgets] = useState([
    { category: 'Food', amount: 300 },
    { category: 'Transportation', amount: 200 },
    { category: 'Shopping', amount: 400 },
  ])

  const handleBudgetChange = (index: number, amount: number) => {
    const updatedBudgets = [...budgets]
    updatedBudgets[index].amount = amount
    setBudgets(updatedBudgets)
  }

  return (
    <div className={styles.budgetSetup}>
      <h2>Budget Setup</h2>
      <ul>
        {budgets.map((budget, index) => (
          <li key={index}>
            <span>{budget.category}:</span>
            <input
              type="number"
              value={budget.amount}
              onChange={(e) => handleBudgetChange(index, parseInt(e.target.value, 10))}
            />
          </li>
        ))}
      </ul>
      <button>Save Budgets</button>
    </div>
  )
}

export default BudgetSetup

import React, { useState } from 'react'
import styles from './IncomeExpenseForm.module.css'

const IncomeExpenseForm = ({ onAdd }: { onAdd: (transaction: { type: string; amount: number; description: string }) => void }) => {
  const [type, setType] = useState('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    onAdd({ type, amount: parseFloat(amount), description })
    setAmount('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.incomeExpenseForm}>
      <div>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

export default IncomeExpenseForm

import React, { useState } from 'react'
import styles from './IncomeExpenseForm.module.css'

// Custom hook for managing form state
const useFormState = (initialState: { [key: string]: string }) => {
  const [formState, setFormState] = useState(initialState)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prevState) => ({ ...prevState, [name]: value }))
  }

  return { formState, handleChange, setFormState }
}

const IncomeExpenseForm = ({
  onAdd,
  labels = { type: 'Loại', amount: 'Số tiền', description: 'Mô tả' },
  options = { income: 'Thu nhập', expense: 'Chi tiêu' }
}: {
  onAdd: (transaction: { type: string; amount: number; description: string }) => void
  labels?: { type: string; amount: string; description: string }
  options?: { income: string; expense: string }
}) => {
  const { formState, handleChange, setFormState } = useFormState({
    type: 'income',
    amount: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const amount = parseFloat(formState.amount)
    if (isNaN(amount) || amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ và lớn hơn 0')
      return
    }
    onAdd({ type: formState.type, amount, description: formState.description })
    setFormState({ type: 'income', amount: '', description: '' })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.incomeExpenseForm}>
      <div>
        <label>
          {labels.type}:
          <select name='type' value={formState.type} onChange={handleChange}>
            <option value='income'>{options.income}</option>
            <option value='expense'>{options.expense}</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          {labels.amount}:
          <input type='number' name='amount' value={formState.amount} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          {labels.description}:
          <input type='text' name='description' value={formState.description} onChange={handleChange} required />
        </label>
      </div>
      <button type='submit'>Thêm</button>
    </form>
  )
}

export default IncomeExpenseForm

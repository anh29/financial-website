import React, { useState } from 'react'

const BudgetSuggestionsPage = () => {
  const [income, setIncome] = useState('')
  const [suggestion, setSuggestion] = useState('')

  const handleSuggestBudget = (): void => {
    const incomeAmount = parseFloat(income)
    if (incomeAmount > 0) {
      const suggestedBudget = incomeAmount * 0.5
      setSuggestion(`Ngân sách đề xuất cho chi tiêu: ${suggestedBudget.toLocaleString('vi-VN')} VND`)
    } else {
      setSuggestion('Vui lòng nhập số tiền thu nhập hợp lệ.')
    }
  }

  return (
    <div>
      <h1>Đề Xuất Ngân Sách</h1>
      <div>
        <label>
          Thu nhập hàng tháng:
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </label>
        <button onClick={handleSuggestBudget}>Nhận Đề Xuất Ngân Sách</button>
      </div>
      {suggestion && <p>{suggestion}</p>}
    </div>
  )
}

export default BudgetSuggestionsPage

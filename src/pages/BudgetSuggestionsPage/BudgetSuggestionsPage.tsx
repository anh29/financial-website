import React, { useState } from 'react'

const BudgetSuggestionsPage = () => {
  const [income, setIncome] = useState('')
  const [suggestion, setSuggestion] = useState('')

  const handleSuggestBudget = (): void => {
    const incomeAmount = parseFloat(income)
    if (incomeAmount > 0) {
      const suggestedBudget = incomeAmount * 0.5
      setSuggestion(`Suggested budget for expenses: $${suggestedBudget.toFixed(2)}`)
    } else {
      setSuggestion('Please enter a valid income amount.')
    }
  }

  return (
    <div>
      <h1>Budget Suggestions</h1>
      <div>
        <label>
          Monthly Income:
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </label>
        <button onClick={handleSuggestBudget}>Get Budget Suggestion</button>
      </div>
      {suggestion && <p>{suggestion}</p>}
    </div>
  )
}

export default BudgetSuggestionsPage

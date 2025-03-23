import React, { useState } from 'react'
import axios from 'axios'

const FinancialAdvicePage = () => {
  const [advice, setAdvice] = useState('')

  const getFinancialAdvice = async (): Promise<void> => {
    try {
      const response = await axios.get('/api/financial-advice')
      setAdvice(response.data.advice)
    } catch (error) {
      console.error('Error fetching financial advice:', error)
    }
  }

  return (
    <div>
      <h1>Financial Advice</h1>
      <button onClick={getFinancialAdvice}>Get Financial Advice</button>
      {advice && <p>{advice}</p>}
    </div>
  )
}

export default FinancialAdvicePage

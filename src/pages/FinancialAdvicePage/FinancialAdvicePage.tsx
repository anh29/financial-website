import { useState } from 'react'
import axios from 'axios'

const FinancialAdvicePage = () => {
  const [advice, setAdvice] = useState('')

  const getFinancialAdvice = async (): Promise<void> => {
    try {
      const response = await axios.get('/api/financial-advice')
      setAdvice(response.data.advice)
    } catch (error) {
      console.error('Lỗi khi lấy lời khuyên tài chính:', error)
    }
  }

  return (
    <div>
      <h1>Lời Khuyên Tài Chính</h1>
      <button onClick={getFinancialAdvice}>Nhận Lời Khuyên Tài Chính</button>
      {advice && <p>{advice}</p>}
    </div>
  )
}

export default FinancialAdvicePage

import React, { useState } from 'react'
import styles from './LanguageCurrency.module.css'

const LanguageCurrency = () => {
  const [language, setLanguage] = useState('English')
  const [currency, setCurrency] = useState('USD')

  const handleSave = () => {
    console.log('Language:', language, 'Currency:', currency)
  }

  return (
    <div className={styles.languageCurrency}>
      <h2>Language & Currency</h2>
      <label>
        Language:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>
      </label>
      <label>
        Currency:
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}

export default LanguageCurrency

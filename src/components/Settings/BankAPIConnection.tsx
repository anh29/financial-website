import React from 'react'
import styles from './BankAPIConnection.module.css'

const BankAPIConnection = () => {
  const handleConnect = () => {
    console.log('Connecting to bank API...')
  }

  return (
    <div className={styles.bankAPIConnection}>
      <h2>Bank API Connection</h2>
      <p>Connect your bank account to automatically import transactions.</p>
      <button onClick={handleConnect}>Connect Bank</button>
    </div>
  )
}

export default BankAPIConnection

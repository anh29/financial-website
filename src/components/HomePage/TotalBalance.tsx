import React from 'react'
import styles from './TotalBalance.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'

const TotalBalance = () => {
  return (
    <div className={styles.totalBalance}>
      <h2>Total Balance</h2>
      <p>$240,399</p>
      <div className={styles.card}>
        <FontAwesomeIcon icon={faCreditCard} />
        <div>
          <p>Account Type</p>
          <p>Credit Card</p>
          <p>**** **** **** 2598</p>
          <p>$25,000</p>
        </div>
      </div>
    </div>
  )
}

export default TotalBalance

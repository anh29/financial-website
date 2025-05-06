import React, { useState } from 'react'
import styles from './ImportButton.module.css'
import TransactionModal from './TransactionModal'

const ImportButton = ({ onImport }: { onImport: (transactions: any[]) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <button className={styles.importButton} onClick={handleOpenModal}>
        Add Transactions
      </button>
      {isModalOpen && <TransactionModal onClose={handleCloseModal} onSave={onImport} initialTransactions={[]} />}
    </>
  )
}

export default ImportButton

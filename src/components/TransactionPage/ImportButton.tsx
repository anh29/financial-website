import { useState } from 'react'
import styles from './ImportButton.module.css'
import TransactionModal from './TransactionModal'
import { Transaction } from '../../types/transaction'

const ImportButton = ({ onImport }: { onImport: (newTransactions: Transaction[]) => void }) => {
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
        Thêm Giao Dịch
      </button>
      {isModalOpen && <TransactionModal onClose={handleCloseModal} onSave={onImport} initialTransactions={[]} />}
    </>
  )
}

export default ImportButton

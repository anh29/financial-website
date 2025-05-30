import React, { useState } from 'react'
import styles from './OCRUpload.module.css'
import TransactionModal from './TransactionModal'
import { Transaction } from '../../types/transaction'
import { expenseCategories } from '../../utils/categoryUtils'
import { classifyTransaction } from '../../services/features/transactionService'

const OCRUpload = ({ onUpload }: { onUpload: (transactions: Transaction[]) => void }) => {
  const [ocrTransactions, setOcrTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    const formData = new FormData()
    formData.append('api_key', 'TEST')
    formData.append('recognizer', 'auto')
    formData.append('ref_no', `ocr-${Date.now()}`)
    formData.append('file', file)

    setIsLoading(true)

    try {
      const response = await fetch('https://ocr.asprise.com/api/v1/receipt', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success && result.receipts && result.receipts.length > 0) {
        const items = result.receipts[0].items || []

        const classifiedTransactions: Transaction[] = await Promise.all(
          items.map(async (item: { description: string; amount: number }) => {
            const description = item.description || ''
            const amount = item.amount || 0

            try {
              const { predictedCategory } = await classifyTransaction({ description })

              return {
                date: new Date().toISOString().split('T')[0],
                amount,
                description,
                source: result.ocr_type || 'OCR',
                type: 'expense',
                category: predictedCategory.key
              }
            } catch {
              return {
                date: new Date().toISOString().split('T')[0],
                amount,
                description,
                source: result.ocr_type || 'OCR',
                type: 'expense',
                category: expenseCategories[0].key,
                classificationError: '⚠ Failed to classify'
              }
            }
          })
        )

        setOcrTransactions(classifiedTransactions)
        setIsModalOpen(true)
      } else {
        throw new Error('OCR result format is invalid or empty.')
      }
    } catch (error) {
      console.error('OCR upload failed:', error)
      alert('Failed to process the invoice. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalSave = (updatedTransactions: Transaction[]) => {
    onUpload(updatedTransactions)
    setIsModalOpen(false)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className={styles.ocrUploadContainer}>
      <label htmlFor='ocr-upload' className={styles.uploadLabel}>
        Tải Hóa Đơn
      </label>
      <input
        type='file'
        id='ocr-upload'
        accept='image/*,application/pdf'
        onChange={handleUpload}
        className={styles.uploadInput}
      />
      {isLoading && <div className={styles.loading}>Processing OCR & Classifying...</div>}
      {isModalOpen && (
        <TransactionModal onClose={handleModalClose} onSave={handleModalSave} initialTransactions={ocrTransactions} />
      )}
    </div>
  )
}

export default OCRUpload

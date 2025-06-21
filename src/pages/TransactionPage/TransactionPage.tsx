import styles from './TransactionPage.module.css'
import TransactionTable from '../../components/TransactionPage/TransactionTable'
import ImportButton from '../../components/TransactionPage/ImportButton'
import OCRUpload from '../../components/TransactionPage/OCRUpload'
import PhotoCapture from '../../components/TransactionPage/PhotoCapture'
import TransactionModal from '../../components/TransactionPage/TransactionModal'
import SearchFilter, { SearchFilterState } from '../../components/TransactionPage/SearchFilter'
import { LoadingSpinner } from '../../components/common'
import { useTransactions } from '../../hooks/features/useTransactions'
import { useEffect, useState } from 'react'
import { Transaction } from '../../types/transaction'
import { FloatingActionButton } from '../../components/common/FloatingActionButton/FloatingActionButton'
import { useIsMobile } from '../../utils/helpers'
import { FaCamera } from 'react-icons/fa'
import { processReceiptImage, createTransactionsFromOCR, createTransactionFromOCR, OCRResult } from '../../services/features/ocrService'

const TransactionPage = () => {
  const { transactions, isLoading, handleImport, fetchTransactions } = useTransactions()
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>([])
  const [showFabModal, setShowFabModal] = useState(false)
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [ocrTransactions, setOcrTransactions] = useState<Transaction[]>([])
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [filter, setFilter] = useState<SearchFilterState>({
    searchTerm: '',
    viewMode: 'compact',
    typeFilter: 'all'
  })
  const isMobile = useIsMobile()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleTransactionUpdate = (transactions: Transaction[]) => {
    setUpdatedTransactions(transactions)
  }

  const handleAddTransaction = () => {
    setShowFabModal(true)
  }

  const handleFabClose = () => setShowFabModal(false)

  const handlePhotoCapture = async (file: File) => {
    try {
      setIsProcessingOCR(true)
      setShowPhotoCapture(false)
      setShowFabModal(false)

      // Process the captured image with OCR
      const result = await processReceiptImage(file)
      setOcrResult(result)

      if (result.success && result.transactions && result.transactions.length > 0) {
        // Show transaction modal for review
        setOcrTransactions(result.transactions)
        setShowTransactionModal(true)
      } else if (result.success && result.data) {
        // Create single transaction from OCR data
        await createTransactionFromOCR(result.data)
        await fetchTransactions() // Refresh the transactions list
      }
    } catch (error) {
      console.error('Error processing photo:', error)
      setOcrResult({
        success: false,
        error: 'Có lỗi xảy ra khi xử lý ảnh biên lai.'
      })
    } finally {
      setIsProcessingOCR(false)
    }
  }

  const handlePhotoCaptureClose = () => {
    setShowPhotoCapture(false)
  }

  const handleTransactionModalSave = async (updatedTransactions: Transaction[]) => {
    try {
      await createTransactionsFromOCR(updatedTransactions)
      await fetchTransactions() // Refresh the transactions list
      setShowTransactionModal(false)
      setOcrResult({
        success: true,
        data: {
          amount: updatedTransactions.reduce((sum, t) => sum + t.amount, 0),
          description: `Receipt with ${updatedTransactions.length} items`,
          date: new Date().toISOString().split('T')[0],
          merchant: 'OCR',
          category: 'other'
        }
      })
    } catch (error) {
      console.error('Error saving transactions:', error)
      setOcrResult({
        success: false,
        error: 'Không thể lưu giao dịch. Vui lòng thử lại.'
      })
    }
  }

  const handleTransactionModalClose = () => {
    setShowTransactionModal(false)
  }

  const getFilteredTransactions = () => {
    // Ensure transactions is an array
    let txs = transactions || []
    
    if (filter.typeFilter !== 'all') {
      txs = txs.filter((t) => t.type === filter.typeFilter)
    }
    if (filter.searchTerm.trim()) {
      const term = filter.searchTerm.toLowerCase()
      txs = txs.filter(
        (t) =>
          t.description?.toLowerCase().includes(term) ||
          t.category?.toLowerCase().includes(term) ||
          t.source?.toLowerCase().includes(term)
      )
    }
    return txs
  }

  // Ensure transactions is an array for safe access
  const safeTransactions = transactions || []

  return (
    <div className={styles.transactionPage}>
      <header className={styles.header}>
        <h1>📊 Bảng Điều Khiển Giao Dịch</h1>
        <p>Nhập, xem và quản lý các giao dịch tài chính của bạn một cách dễ dàng.</p>
      </header>

      <div className={`${styles.controls} transaction-filters`}>
        <SearchFilter onFilterChange={setFilter} />
      </div>

      <div className='transactions-section'>
        {isLoading && <LoadingSpinner />}
        {!isLoading && safeTransactions.length === 0 && <p>Không tìm thấy giao dịch nào.</p>}
        {!isLoading && safeTransactions.length > 0 && (
          <TransactionTable
            transactions={getFilteredTransactions()}
            updatedTransactions={updatedTransactions}
            onTransactionUpdate={handleTransactionUpdate}
            viewMode={filter.viewMode}
          />
        )}
      </div>

      <div className='transaction-actions'>
        <FloatingActionButton onClick={handleAddTransaction} />
        {showFabModal && (
          <div className={styles.floatingActionModalWrapper} onClick={handleFabClose}>
            <div className={styles.floatingActionModalContent} onClick={(e) => e.stopPropagation()}>
              {isMobile && (
                <button 
                  className={styles.actionButton}
                  onClick={() => setShowPhotoCapture(true)}
                >
                  <FaCamera />
                  <span>Chụp ảnh biên lai</span>
                </button>
              )}
              <ImportButton onImport={handleImport} />
              <OCRUpload onUpload={handleImport} />
            </div>
          </div>
        )}
      </div>

      {showPhotoCapture && (
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          onClose={handlePhotoCaptureClose}
        />
      )}

      {showTransactionModal && (
        <TransactionModal
          onClose={handleTransactionModalClose}
          onSave={handleTransactionModalSave}
          initialTransactions={ocrTransactions}
        />
      )}

      {/* OCR Processing Overlay */}
      {isProcessingOCR && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingContent}>
            <LoadingSpinner />
            <p>Đang xử lý ảnh biên lai...</p>
          </div>
        </div>
      )}

      {/* OCR Result Notification */}
      {ocrResult && !isProcessingOCR && !showTransactionModal && (
        <div className={`${styles.ocrResult} ${ocrResult.success ? styles.success : styles.error}`}>
          <div className={styles.ocrResultContent}>
            <h4>{ocrResult.success ? '✅ Thành công!' : '❌ Lỗi'}</h4>
            <p>{ocrResult.success ? 'Đã tạo giao dịch từ biên lai' : ocrResult.error}</p>
            <button 
              className={styles.closeOcrResult}
              onClick={() => setOcrResult(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionPage

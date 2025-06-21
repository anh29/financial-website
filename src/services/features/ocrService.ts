import { apiClient } from '../../config/apiClient'
import { Transaction } from '../../types/transaction'
import { expenseCategories } from '../../utils/categoryUtils'
import { classifyTransaction } from './transactionService'

export interface OCRResult {
  success: boolean
  data?: {
    amount?: number
    description?: string
    date?: string
    merchant?: string
    category?: string
  }
  error?: string
  transactions?: Transaction[]
}

export const processReceiptImage = async (imageFile: File): Promise<OCRResult> => {
  try {
    const formData = new FormData()
    formData.append('api_key', 'TEST')
    formData.append('recognizer', 'auto')
    formData.append('ref_no', `ocr-${Date.now()}`)
    formData.append('file', imageFile)

    const response = await fetch('https://ocr.asprise.com/api/v1/receipt', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.success && result.receipts && result.receipts.length > 0) {
      const receipt = result.receipts[0]
      const items = receipt.items || []
      
      // Process each item from the receipt
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
              category: predictedCategory.key,
              id: `temp-${Date.now()}-${Math.random()}`,
              is_amortized: false
            }
          } catch {
            return {
              date: new Date().toISOString().split('T')[0],
              amount,
              description,
              source: result.ocr_type || 'OCR',
              type: 'expense',
              category: expenseCategories[0].key,
              classificationError: '⚠ Failed to classify',
              id: `temp-${Date.now()}-${Math.random()}`,
              is_amortized: false
            }
          }
        })
      )

      // If no items found, create a single transaction from receipt total
      if (classifiedTransactions.length === 0 && receipt.total) {
        const totalAmount = receipt.total
        const merchant = receipt.merchant_name || 'Unknown Merchant'
        
        try {
          const { predictedCategory } = await classifyTransaction({ description: merchant })

          classifiedTransactions.push({
            date: new Date().toISOString().split('T')[0],
            amount: totalAmount,
            description: `Receipt from ${merchant}`,
            source: result.ocr_type || 'OCR',
            type: 'expense',
            category: predictedCategory.key,
            id: `temp-${Date.now()}-${Math.random()}`,
            is_amortized: false
          })
        } catch {
          classifiedTransactions.push({
            date: new Date().toISOString().split('T')[0],
            amount: totalAmount,
            description: `Receipt from ${merchant}`,
            source: result.ocr_type || 'OCR',
            type: 'expense',
            category: expenseCategories[0].key,
            id: `temp-${Date.now()}-${Math.random()}`,
            is_amortized: false
          })
        }
      }

      return {
        success: true,
        data: {
          amount: receipt.total || 0,
          description: `Receipt from ${receipt.merchant_name || 'Unknown'}`,
          date: receipt.date || new Date().toISOString().split('T')[0],
          merchant: receipt.merchant_name || 'Unknown',
          category: 'other'
        },
        transactions: classifiedTransactions
      }
    } else {
      return {
        success: false,
        error: 'Không thể nhận dạng biên lai. Vui lòng thử lại với ảnh rõ nét hơn.'
      }
    }
  } catch (error) {
    console.error('OCR processing error:', error)
    return {
      success: false,
      error: 'Không thể xử lý ảnh biên lai. Vui lòng thử lại.'
    }
  }
}

export const createTransactionFromOCR = async (ocrData: any): Promise<Transaction> => {
  try {
    const transactionData = {
      amount: ocrData.amount || 0,
      description: ocrData.description || 'Giao dịch từ biên lai',
      category: ocrData.category || 'other',
      type: 'expense',
      date: ocrData.date || new Date().toISOString(),
      source: ocrData.merchant || 'Receipt OCR',
      is_amortized: false
    }

    const response = await apiClient.post('/crud/transactions', transactionData)
    return response.data
  } catch (error) {
    console.error('Error creating transaction from OCR:', error)
    throw new Error('Không thể tạo giao dịch từ dữ liệu OCR')
  }
}

export const createTransactionsFromOCR = async (transactions: Transaction[]): Promise<Transaction[]> => {
  try {
    const createdTransactions: Transaction[] = []
    
    for (const transaction of transactions) {
      const transactionData = {
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
        source: transaction.source || 'OCR',
        is_amortized: false
      }

      const response = await apiClient.post('/crud/transactions', transactionData)
      createdTransactions.push(response.data)
    }

    return createdTransactions
  } catch (error) {
    console.error('Error creating transactions from OCR:', error)
    throw new Error('Không thể tạo giao dịch từ dữ liệu OCR')
  }
}

// Fallback OCR processing using client-side libraries (if server OCR is not available)
export const processReceiptImageClientSide = async (): Promise<OCRResult> => {
  return new Promise((resolve) => {
    // This is a placeholder for client-side OCR processing
    // You can integrate libraries like Tesseract.js here
    setTimeout(() => {
      resolve({
        success: false,
        error: 'OCR processing not available. Please enter transaction details manually.'
      })
    }, 1000)
  })
} 
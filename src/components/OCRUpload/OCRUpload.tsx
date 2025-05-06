import React, { useState } from 'react'
import styles from './OCRUpload.module.css'

const OCRUpload = ({ onUpload }: { onUpload: (transactions: any[]) => void }) => {
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Mock OCR result
      const mockTransaction = [
        { date: '2023-07-22', amount: 75, category: 'Entertainment', description: 'Movie', source: 'OCR' }
      ]
      onUpload(mockTransaction)
    }
  }

  return (
    <div className={styles.ocrUpload}>
      <h2>Upload Invoice</h2>
      <div className={styles.uploadContainer}>
        <label htmlFor="ocr-upload" className={styles.uploadLabel}>
          Drag & Drop or Click to Upload
        </label>
        <input
          type="file"
          id="ocr-upload"
          accept="image/*,application/pdf"
          onChange={handleUpload}
          className={styles.uploadInput}
        />
      </div>
      {preview && (
        <div className={styles.preview}>
          <h3>Preview</h3>
          <img src={preview} alt="Uploaded Preview" className={styles.previewImage} />
        </div>
      )}
    </div>
  )
}

export default OCRUpload

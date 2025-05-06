import React from 'react'
import styles from './ExportData.module.css'

const ExportData = () => {
  const handleExport = () => {
    console.log('Exporting data...')
  }

  return (
    <div className={styles.exportData}>
      <h2>Export Data</h2>
      <p>Export your financial data as a CSV or PDF file.</p>
      <button onClick={handleExport}>Export</button>
    </div>
  )
}

export default ExportData

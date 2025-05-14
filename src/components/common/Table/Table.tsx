import React from 'react'
import styles from './Table.module.css'

interface TableProps {
  columns: { key: string; header: string }[]
  data: any[]
  onRowClick?: (row: any) => void
}

export const Table: React.FC<TableProps> = ({ columns, data, onRowClick }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? styles.clickable : ''}
            >
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 
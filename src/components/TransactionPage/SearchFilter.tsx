import { useState } from 'react'
import styles from './SearchFilter.module.css'

export interface SearchFilterState {
  searchTerm: string
  viewMode: 'compact' | 'detailed'
  typeFilter: 'all' | 'income' | 'expense'
}

const defaultState: SearchFilterState = {
  searchTerm: '',
  viewMode: 'compact',
  typeFilter: 'all'
}

const SearchFilter = ({ onFilterChange }: { onFilterChange?: (state: SearchFilterState) => void }) => {
  const [state, setState] = useState<SearchFilterState>(defaultState)

  const handleChange = (changes: Partial<SearchFilterState>) => {
    const newState = { ...state, ...changes }
    setState(newState)
    if (onFilterChange) onFilterChange(newState)
  }

  return (
    <div className={styles.searchFilterBar}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type='text'
          placeholder='Tìm kiếm giao dịch của bạn...'
          value={state.searchTerm}
          onChange={(e) => handleChange({ searchTerm: e.target.value })}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.filterControls}>
        <button
          className={styles.toggleBtn + (state.viewMode === 'compact' ? ' ' + styles.active : '')}
          onClick={() => handleChange({ viewMode: 'compact' })}
          type='button'
        >
          <span className={styles.toggleIcon}>≡</span> Gọn
        </button>
        <button
          className={styles.toggleBtn + (state.viewMode === 'detailed' ? ' ' + styles.active : '')}
          onClick={() => handleChange({ viewMode: 'detailed' })}
          type='button'
        >
          <span className={styles.toggleIcon}>▦</span> Chi tiết
        </button>
        <button
          className={styles.incomeBtn + (state.typeFilter === 'income' ? ' ' + styles.active : '')}
          onClick={() => handleChange({ typeFilter: 'income' })}
          type='button'
        >
          <span className={styles.incomeIcon}>↗️</span> Thu nhập
        </button>
        <button
          className={styles.expenseBtn + (state.typeFilter === 'expense' ? ' ' + styles.active : '')}
          onClick={() => handleChange({ typeFilter: 'expense' })}
          type='button'
        >
          <span className={styles.expenseIcon}>↘️</span> Chi tiêu
        </button>
      </div>
    </div>
  )
}

export default SearchFilter

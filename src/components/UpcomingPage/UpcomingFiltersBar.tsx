import React from 'react'
import styles from './UpcomingFiltersBar.module.css'
import { FaSearch } from 'react-icons/fa'
import { expenseCategories } from '../../utils/categoryUtils'

interface UpcomingFiltersBarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
}

const UpcomingFiltersBar: React.FC<UpcomingFiltersBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange
}) => (
  <div className={styles.upcomingFiltersBar}>
    <div className={styles.searchBox}>
      <FaSearch className={styles.searchIcon} />
      <input
        type='text'
        placeholder='Tìm kiếm hóa đơn...'
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <div className={styles.filters}>
      <select
        className={styles.filterSelect}
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option>Tất cả</option>
        <option>Đã thanh toán</option>
        <option>Chưa thanh toán</option>
      </select>
      <select
        className={styles.filterSelect}
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
      >
        <option>Tất cả</option>
        {expenseCategories.map((category) => (
          <option key={category.key} value={category.label}>
            {category.label}
          </option>
        ))}
        <option>Khác</option>
      </select>
    </div>
  </div>
)

export default UpcomingFiltersBar

import { useState } from 'react'
import styles from './SearchFilter.module.css'

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  const handleSearch = () => {
    console.log('Search Term:', searchTerm, 'Category:', category)
  }

  return (
    <div className={styles.searchFilter}>
      <input
        type='text'
        placeholder='Search by keyword...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value=''>All Categories</option>
        <option value='Food'>Food</option>
        <option value='Transportation'>Transportation</option>
        <option value='Shopping'>Shopping</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchFilter

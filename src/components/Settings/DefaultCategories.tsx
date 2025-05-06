import React, { useState } from 'react'
import styles from './DefaultCategories.module.css'

const DefaultCategories = () => {
  const [categories, setCategories] = useState(['Food', 'Transportation', 'Shopping'])

  const handleAddCategory = () => {
    const newCategory = prompt('Enter a new category:')
    if (newCategory) {
      setCategories([...categories, newCategory])
    }
  }

  return (
    <div className={styles.defaultCategories}>
      <h2>Default Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
      <button onClick={handleAddCategory}>Add Category</button>
    </div>
  )
}

export default DefaultCategories

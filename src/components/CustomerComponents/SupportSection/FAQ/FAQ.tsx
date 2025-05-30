import React from 'react'
import { Card, Badge, LoadingSpinner } from '../../../common'
import styles from './FAQ.module.css'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export const FAQ: React.FC = () => {
  const isLoading = false
  const selectedCategory = 'all'
  const faqItems: FAQItem[] = []

  const filteredFAQs =
    selectedCategory === 'all' ? faqItems : faqItems.filter((item) => item.category === selectedCategory)

  return (
    <div className={styles.faq}>
      <div className={styles.faqContainer}>
        <h1>Câu Hỏi Thường Gặp</h1>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className={styles.categories}>
              <Badge variant={selectedCategory === 'all' ? 'primary' : 'success'}>Tất cả</Badge>
              {/* Add more category badges */}
            </div>

            <div className={styles.faqList}>
              {filteredFAQs.map((item, index) => (
                <Card key={index} className={styles.faqItem}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                  <Badge variant='primary' size='small'>
                    {item.category}
                  </Badge>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

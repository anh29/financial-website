import React from 'react'
import { Card, Form, Input, Select, Button } from '../../../common'
import styles from './Feedback.module.css'

export const Feedback: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    type: '',
    rating: '',
    comment: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Handle form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.feedbackContainer}>
      <h1>Phản Hồi Của Bạn</h1>

      <Card className={styles.feedbackForm}>
        <Form onSubmit={handleSubmit}>
          <Select
            label='Loại Phản Hồi'
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'bug', label: 'Báo Lỗi' },
              { value: 'feature', label: 'Yêu Cầu Tính Năng' },
              { value: 'improvement', label: 'Đề Xuất Cải Thiện' }
            ]}
            required
          />

          <Select
            label='Đánh Giá'
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            options={[
              { value: '5', label: '⭐⭐⭐⭐⭐' },
              { value: '4', label: '⭐⭐⭐⭐' },
              { value: '3', label: '⭐⭐⭐' },
              { value: '2', label: '⭐⭐' },
              { value: '1', label: '⭐' }
            ]}
            required
          />

          <Input
            label='Phản Hồi Của Bạn'
            type='text'
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
          />

          <Button type='submit' fullWidth isLoading={isLoading}>
            Gửi Phản Hồi
          </Button>
        </Form>
      </Card>
    </div>
  )
}

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
    <div className={styles.feedbackPage}>
      <div className={styles.feedbackContainer}>
        <h1>Your Feedback</h1>

        <Card className={styles.feedbackForm}>
          <Form onSubmit={handleSubmit}>
            <Select
              label='Feedback Type'
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'bug', label: 'Bug Report' },
                { value: 'feature', label: 'Feature Request' },
                { value: 'improvement', label: 'Improvement Suggestion' }
              ]}
              required
            />

            <Select
              label='Rating'
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
              label='Your Feedback'
              type='text'
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            />

            <Button type='submit' fullWidth isLoading={isLoading}>
              Submit Feedback
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  )
}

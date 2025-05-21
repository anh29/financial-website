import React from 'react'
import { Card, Form, Input, Button, Badge } from '../../../common'
import styles from './Contact.module.css'

export const Contact: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
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
    <div className={styles.contact}>
      <div className={styles.contactContainer}>
        <h1>Contact Us</h1>

        <Card className={styles.contactForm}>
          <Form onSubmit={handleSubmit}>
            <Input
              label='Name'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label='Email'
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label='Message'
              type='text'
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            <Button type='submit' fullWidth isLoading={isLoading}>
              Send Message
            </Button>
          </Form>
        </Card>

        <Card className={styles.contactInfo}>
          <h2>Other Ways to Reach Us</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>Email</h3>
              <p>support@financialapp.com</p>
              <Badge variant='primary'>24/7 Support</Badge>
            </div>
            <div className={styles.infoItem}>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <Badge variant='success'>Available</Badge>
            </div>
            <div className={styles.infoItem}>
              <h3>Address</h3>
              <p>123 Financial Street, New York, NY 10001</p>
              <Badge variant='warning'>Office Hours</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

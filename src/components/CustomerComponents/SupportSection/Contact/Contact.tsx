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
        <h1>Liên Hệ Với Chúng Tôi</h1>

        <Card className={styles.contactForm}>
          <Form onSubmit={handleSubmit}>
            <Input
              label='Họ và tên'
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
              label='Nội dung'
              type='text'
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            <Button type='submit' fullWidth isLoading={isLoading}>
              Gửi Tin Nhắn
            </Button>
          </Form>
        </Card>

        <Card className={styles.contactInfo}>
          <h2>Các Cách Khác Để Liên Hệ</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>Email</h3>
              <p>support@financialapp.com</p>
              <Badge variant='primary'>Hỗ Trợ 24/7</Badge>
            </div>
            <div className={styles.infoItem}>
              <h3>Điện thoại</h3>
              <p>+84 (123) 456-7890</p>
              <Badge variant='success'>Có sẵn</Badge>
            </div>
            <div className={styles.infoItem}>
              <h3>Địa chỉ</h3>
              <p>123 Đường Tài Chính, Hà Nội, Việt Nam</p>
              <Badge variant='warning'>Giờ Làm Việc</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

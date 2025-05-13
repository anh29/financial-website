import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Contact.module.css'
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import Log from '../../../Log/Log'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const Contact: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_email: import.meta.env.VITE_SUPPORT_EMAIL
      }

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending email:', error)
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return <Log message='Email đã được gửi thành công!' status='success' onClose={() => setIsSuccess(false)} />
  }

  return (
    <div className={styles.contactContainer}>
      <button className={styles.backButton} onClick={() => navigate('/customer/support')}>
        <FaArrowLeft /> Quay lại
      </button>

      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <h1>Liên hệ với chúng tôi</h1>
          <p className={styles.subtitle}>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <FaPhone className={styles.infoIcon} />
              <h3>Điện thoại</h3>
              <p>1900 1234</p>
            </div>

            <div className={styles.infoCard}>
              <FaEnvelope className={styles.infoIcon} />
              <h3>Email</h3>
              <p>{import.meta.env.VITE_SUPPORT_EMAIL}</p>
            </div>

            <div className={styles.infoCard}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <h3>Địa chỉ</h3>
              <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
            </div>

            <div className={styles.infoCard}>
              <FaClock className={styles.infoIcon} />
              <h3>Giờ làm việc</h3>
              <p>24/7</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại của bạn"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Chủ đề</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn chủ đề</option>
              <option value="technical">Vấn đề kỹ thuật</option>
              <option value="account">Tài khoản</option>
              <option value="billing">Thanh toán</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Nội dung</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              placeholder="Nhập nội dung cần hỗ trợ"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact 
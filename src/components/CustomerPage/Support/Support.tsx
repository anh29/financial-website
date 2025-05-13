import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Support.module.css'
import { FaQuestionCircle, FaHeadset, FaBook, FaComments } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import Log from '../../Log/Log'
import { EMAILJS_CONFIG } from '../../../utils/constants'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const Support: React.FC = () => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
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
        subject: formData.subject,
        message: formData.message,
        to_email: EMAILJS_CONFIG.SUPPORT_EMAIL
      }

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      )

      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
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

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  if (isSuccess) {
    return <Log message='Email đã được gửi thành công!' status='success' onClose={() => setIsSuccess(false)} />
  }

  return (
    <div className={styles.supportPage}>
      <div className={styles.supportHero}>
        <h1>Hỗ trợ khách hàng</h1>
        <p className={styles.subtitle}>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
      </div>

      <div className={styles.supportContent}>
        {/* Quick Help Section */}
        <section className={styles.quickHelp}>
          <h2>Hỗ trợ nhanh</h2>
          <div className={styles.helpGrid}>
            <div className={styles.helpCard}>
              <FaQuestionCircle className={styles.helpIcon} />
              <h3>FAQ</h3>
              <p>Các câu hỏi thường gặp</p>
              <button className={styles.helpButton} onClick={() => handleNavigation('/customer/support/faq')}>
                Xem FAQ
              </button>
            </div>

            <div className={styles.helpCard}>
              <FaHeadset className={styles.helpIcon} />
              <h3>Liên hệ hỗ trợ</h3>
              <p>Đội ngũ hỗ trợ 24/7</p>
              <button className={styles.helpButton} onClick={() => handleNavigation('/customer/support/contact')}>
                Liên hệ ngay
              </button>
            </div>

            <div className={styles.helpCard}>
              <FaBook className={styles.helpIcon} />
              <h3>Hướng dẫn sử dụng</h3>
              <p>Tài liệu hướng dẫn chi tiết</p>
              <button className={styles.helpButton} onClick={() => handleNavigation('/customer/support/guide')}>
                Xem hướng dẫn
              </button>
            </div>

            <div className={styles.helpCard}>
              <FaComments className={styles.helpIcon} />
              <h3>Góp ý</h3>
              <p>Chia sẻ ý kiến của bạn</p>
              <button className={styles.helpButton} onClick={() => handleNavigation('/customer/support/feedback')}>
                Gửi góp ý
              </button>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.contactSection}>
          <h2>Liên hệ với chúng tôi</h2>
          <form ref={formRef} onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor='name'>Họ và tên</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Nhập họ và tên của bạn'
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Nhập email của bạn'
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='subject'>Chủ đề</label>
              <select id='subject' name='subject' value={formData.subject} onChange={handleInputChange} required>
                <option value=''>Chọn chủ đề</option>
                <option value='technical'>Vấn đề kỹ thuật</option>
                <option value='account'>Tài khoản</option>
                <option value='billing'>Thanh toán</option>
                <option value='other'>Khác</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='message'>Nội dung</label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder='Nhập nội dung cần hỗ trợ'
                required
              ></textarea>
            </div>
            <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
            </button>
          </form>
        </section>

        {/* Contact Information */}
        <section className={styles.contactInfo}>
          <h2>Thông tin liên hệ</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>Email hỗ trợ</h3>
              <p>{EMAILJS_CONFIG.SUPPORT_EMAIL}</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Hotline</h3>
              <p>1900 1234</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Giờ làm việc</h3>
              <p>24/7</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Support

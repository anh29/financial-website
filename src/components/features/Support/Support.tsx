import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Support.module.css'
import { FaHeadset, FaBook, FaComments } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import Log from '../../common/Log/Log'
import { EMAILJS_CONFIG } from '../../../utils/constants'
import { Button, Card, Input, Modal, Form } from '../../common'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const Support = () => {
  const navigate = useNavigate()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
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
      setIsLoading(false)
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
      <section className={styles.supportHero}>
        <h1>How can we help you?</h1>
        <p className={styles.subtitle}>We're here to help you with any questions or concerns you may have.</p>
      </section>

      <div className={styles.supportContent}>
        <div className={styles.quickHelp}>
          <h2>Quick Help</h2>
          <div className={styles.helpGrid}>
            <Card>
              <div className={styles.helpCard}>
                <div className={styles.helpIcon}>📚</div>
                <h3>User Guide</h3>
                <p>Learn how to use our platform effectively.</p>
                <Button variant='outline' onClick={() => setIsModalOpen(true)} isLoading={isLoading}>
                  Read Guide
                </Button>
              </div>
            </Card>
            <Card>
              <div className={styles.helpCard}>
                <FaHeadset className={styles.helpIcon} />
                <h3>Liên hệ hỗ trợ</h3>
                <p>Đội ngũ hỗ trợ 24/7</p>
                <Button variant='outline' onClick={() => handleNavigation('/customer/support/contact')}>
                  Liên hệ ngay
                </Button>
              </div>
            </Card>
            <Card>
              <div className={styles.helpCard}>
                <FaBook className={styles.helpIcon} />
                <h3>Hướng dẫn sử dụng</h3>
                <p>Tài liệu hướng dẫn chi tiết</p>
                <Button variant='outline' onClick={() => handleNavigation('/customer/support/guide')}>
                  Xem hướng dẫn
                </Button>
              </div>
            </Card>
            <Card>
              <div className={styles.helpCard}>
                <FaComments className={styles.helpIcon} />
                <h3>Góp ý</h3>
                <p>Chia sẻ ý kiến của bạn</p>
                <Button variant='outline' onClick={() => handleNavigation('/customer/support/feedback')}>
                  Gửi góp ý
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Card className={styles.contactSection}>
          <h2>Contact Us</h2>
          <Form onSubmit={handleSubmit} className={styles.contactForm}>
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

        {/* Contact Information */}
        <Card className={styles.contactInfo}>
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
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='User Guide'>
        <div className={styles.guideContent}>
          <h2>User Guide</h2>
          <p>Learn how to use our platform effectively.</p>
          <Button variant='outline' onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Support

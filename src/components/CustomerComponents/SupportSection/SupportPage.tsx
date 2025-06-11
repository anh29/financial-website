import React, { useState } from 'react'
import { FaHeadset, FaEnvelope, FaComments, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import styles from './SupportPage.module.css'
import { useLanguage } from '../../../context/LanguageContext'

const SupportPage: React.FC = () => {
  const { t } = useLanguage()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const faqs = [
    {
      question: 'Làm thế nào để bắt đầu với nền tảng?',
      answer:
        'Bắt đầu rất dễ dàng! Chỉ cần đăng ký tài khoản, hoàn thành hồ sơ của bạn, và bạn có thể bắt đầu theo dõi tài chính ngay lập tức. Giao diện trực quan của chúng tôi sẽ hướng dẫn bạn qua quá trình thiết lập.'
    },
    {
      question: 'Bạn chấp nhận những phương thức thanh toán nào?',
      answer:
        'Chúng tôi chấp nhận tất cả các loại thẻ tín dụng chính, PayPal và chuyển khoản ngân hàng. Tất cả các giao dịch đều được bảo mật và mã hóa để đảm bảo an toàn cho bạn.'
    },
    {
      question: 'Dữ liệu tài chính của tôi được bảo mật như thế nào?',
      answer:
        'Chúng tôi rất coi trọng vấn đề bảo mật. Tất cả dữ liệu được mã hóa bằng các giao thức tiêu chuẩn ngành, và chúng tôi thường xuyên trải qua các cuộc kiểm tra bảo mật để đảm bảo thông tin của bạn luôn được bảo vệ.'
    },
    {
      question: 'Tôi có thể xuất dữ liệu tài chính của mình không?',
      answer:
        'Có, bạn có thể xuất dữ liệu của mình ở nhiều định dạng khác nhau bao gồm CSV, PDF và Excel. Tính năng này có sẵn trong cài đặt tài khoản của bạn.'
    }
  ]

  const supportOptions = [
    {
      icon: <FaHeadset />,
      title: t('support', 'liveChatTitle'),
      description: t('support', 'liveChatDesc'),
      action: t('support', 'liveChatAction'),
      available: true
    },
    {
      icon: <FaEnvelope />,
      title: t('support', 'emailTitle'),
      description: t('support', 'emailDesc'),
      action: t('support', 'emailAction'),
      available: true
    },
    {
      icon: <FaComments />,
      title: t('support', 'communityTitle'),
      description: t('support', 'communityDesc'),
      action: t('support', 'communityAction'),
      available: true
    },
    {
      icon: <FaBook />,
      title: t('support', 'knowledgeTitle'),
      description: t('support', 'knowledgeDesc'),
      action: t('support', 'knowledgeAction'),
      available: true
    }
  ]

  const handleFaqClick = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
  }

  return (
    <div className={styles.supportPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Chúng tôi có thể giúp gì cho bạn?</h1>
        <p>
          Chúng tôi ở đây để giúp bạn tận dụng tối đa hành trình tài chính của mình. Chọn từ các tùy chọn hỗ trợ bên
          dưới hoặc liên hệ trực tiếp với chúng tôi.
        </p>
      </section>

      {/* Support Options Grid */}
      <section className={styles.supportOptions}>
        {supportOptions.map((option, index) => (
          <div key={index} className={styles.supportCard}>
            <div className={styles.icon}>{option.icon}</div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
            <button className={styles.actionButton}>{option.action}</button>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2>Câu Hỏi Thường Gặp</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${expandedFaq === index ? styles.expanded : ''}`}
              onClick={() => handleFaqClick(index)}
            >
              <div className={styles.faqQuestion}>
                <h3>{faq.question}</h3>
                {expandedFaq === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {expandedFaq === index && <p className={styles.faqAnswer}>{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <h2>Liên Hệ Với Chúng Tôi</h2>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor='name'>Họ và tên</label>
            <input type='text' id='name' name='name' value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='subject'>Tiêu đề</label>
            <input
              type='text'
              id='subject'
              name='subject'
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='message'>Nội dung</label>
            <textarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>
          <button type='submit' className={styles.submitButton}>
            Gửi Tin Nhắn
          </button>
        </form>
      </section>

      {/* Additional Info Section */}
      <section className={styles.additionalInfo}>
        <div className={styles.infoCard}>
          <h3>Giờ Làm Việc</h3>
          <p>Thứ Hai - Thứ Sáu: 9:00 - 18:00</p>
          <p>Thứ Bảy: 10:00 - 16:00</p>
          <p>Chủ Nhật: Nghỉ</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Thông Tin Liên Hệ</h3>
          <p>Email: support@financialwebsite.com</p>
          <p>Điện thoại: +84 (123) 456-7890</p>
          <p>Địa chỉ: 123 Đường Tài Chính, Phòng 100</p>
        </div>
      </section>
    </div>
  )
}

export default SupportPage

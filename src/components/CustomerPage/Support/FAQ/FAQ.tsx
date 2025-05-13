import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FAQ.module.css'
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
}

const FAQ: React.FC = () => {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: 'Làm thế nào để bắt đầu sử dụng FINEbank.IO?',
      answer:
        'Để bắt đầu sử dụng FINEbank.IO, bạn cần đăng ký tài khoản bằng email và mật khẩu. Sau khi đăng ký, bạn có thể bắt đầu theo dõi chi tiêu của mình.'
    },
    {
      question: 'FINEbank.IO có an toàn không?',
      answer:
        'FINEbank.IO sử dụng công nghệ mã hóa tiên tiến để bảo vệ thông tin của bạn. Chúng tôi tuân thủ các tiêu chuẩn bảo mật cao nhất.'
    },
    {
      question: 'Tôi có thể kết nối những ngân hàng nào?',
      answer:
        'Hiện tại, FINEbank.IO không hỗ trợ kết nối với các ngân hàng. Chúng tôi đang không ngừng mở rộng danh sách ngân hàng được hỗ trợ.'
    },
    {
      question: 'Làm thế nào để xem báo cáo chi tiêu?',
      answer:
        'Bạn có thể xem báo cáo chi tiêu trong phần "Báo cáo" của ứng dụng. Chúng tôi cung cấp nhiều loại báo cáo khác nhau như chi tiêu theo danh mục, theo thời gian, và so sánh giữa các tháng.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.faqContainer}>
      <button className={styles.backButton} onClick={() => navigate('/customer/support')}>
        <FaArrowLeft /> Quay lại
      </button>

      <h1>Câu hỏi thường gặp</h1>
      <div className={styles.faqList}>
        {faqItems.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={`${styles.faqQuestion} ${openIndex === index ? styles.open : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              {item.question}
              <FaChevronDown className={styles.icon} />
            </button>
            {openIndex === index && (
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ

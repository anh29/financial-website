import React, { useState } from 'react'
import { FaHeadset, FaEnvelope, FaComments, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import styles from './SupportPage.module.css'

const faqs = [
  {
    question: 'How do I get started with the platform?',
    answer:
      'Getting started is easy! Simply sign up for an account, complete your profile, and you can begin tracking your finances right away. Our intuitive interface will guide you through the setup process.'
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers. All transactions are secure and encrypted for your safety.'
  },
  {
    question: 'How secure is my financial data?',
    answer:
      'We take security very seriously. All data is encrypted using industry-standard protocols, and we regularly undergo security audits to ensure your information remains protected.'
  },
  {
    question: 'Can I export my financial data?',
    answer:
      'Yes, you can export your data in various formats including CSV, PDF, and Excel. This feature is available in your account settings.'
  }
]

const supportOptions = [
  {
    icon: <FaHeadset />,
    title: 'Live Chat Support',
    description: 'Get instant help from our support team',
    action: 'Start Chat',
    available: true
  },
  {
    icon: <FaEnvelope />,
    title: 'Email Support',
    description: 'Send us a detailed message',
    action: 'Send Email',
    available: true
  },
  {
    icon: <FaComments />,
    title: 'Community Forum',
    description: 'Connect with other users',
    action: 'Visit Forum',
    available: true
  },
  {
    icon: <FaBook />,
    title: 'Knowledge Base',
    description: 'Browse our help articles',
    action: 'View Articles',
    available: true
  }
]

const SupportPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

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
        <h1>How can we help you?</h1>
        <p>
          We're here to help you make the most of your financial journey. Choose from our support options below or
          contact us directly.
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
        <h2>Frequently Asked Questions</h2>
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
        <h2>Contact Us</h2>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' name='name' value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='subject'>Subject</label>
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
            <label htmlFor='message'>Message</label>
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
            Send Message
          </button>
        </form>
      </section>

      {/* Additional Info Section */}
      <section className={styles.additionalInfo}>
        <div className={styles.infoCard}>
          <h3>Business Hours</h3>
          <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
          <p>Saturday: 10:00 AM - 4:00 PM EST</p>
          <p>Sunday: Closed</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Contact Information</h3>
          <p>Email: support@financialwebsite.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Financial Street, Suite 100</p>
        </div>
      </section>
    </div>
  )
}

export default SupportPage

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaPiggyBank, FaBullseye, FaChartPie, FaBell, FaShieldAlt, FaArrowRight } from 'react-icons/fa'
import styles from './Features.module.css'

const features = [
  {
    icon: <FaChartLine />,
    title: 'Smart Budgeting',
    description:
      'AI-powered budget suggestions and real-time expense tracking to help you make smarter financial decisions.',
    gradient: 'linear-gradient(135deg,var(--primary-color) 0%, #16a085 100%)',
    path: '/customer/features/daily-tracking'
  },
  {
    icon: <FaPiggyBank />,
    title: 'Expense Tracking',
    description:
      'Track your daily expenses with detailed categorization and insights to understand your spending patterns.',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    path: '/customer/features/daily-cost'
  },
  {
    icon: <FaBullseye />,
    title: 'Goal Setting',
    description: 'Set and track your financial goals with personalized recommendations and progress updates.',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)',
    path: '/customer/features/value-analysis'
  },
  {
    icon: <FaChartPie />,
    title: 'Financial Analytics',
    description: 'Get detailed analytics and insights about your spending patterns and financial health.',
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    path: '/customer/features/smart-decisions'
  },
  {
    icon: <FaBell />,
    title: 'Smart Notifications',
    description:
      'Receive timely alerts and notifications about your spending, savings goals, and financial opportunities.',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    path: '/customer/features/ai-alerts'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Secure Platform',
    description:
      'Bank-level security with encryption and multi-factor authentication to keep your financial data safe.',
    gradient: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
    path: '/customer/features/expense-score'
  }
]

const FeaturesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Features' },
    { id: 'tracking', name: 'Tracking & Analytics' },
    { id: 'planning', name: 'Planning & Goals' },
    { id: 'security', name: 'Security & Notifications' }
  ]

  const filteredFeatures =
    activeCategory === 'all'
      ? features
      : features.filter((feature) => {
          switch (activeCategory) {
            case 'tracking':
              return ['Smart Budgeting', 'Expense Tracking', 'Financial Analytics'].includes(feature.title)
            case 'planning':
              return ['Goal Setting'].includes(feature.title)
            case 'security':
              return ['Smart Notifications', 'Secure Platform'].includes(feature.title)
            default:
              return true
          }
        })

  return (
    <div className={styles.featuresPage}>
      {/* Hero Section */}
      <section className={styles.featureHero}>
        <h1>Powerful Features for Your Financial Success</h1>
        <p className={styles.subtitle}>
          Discover how our comprehensive suite of tools can help you achieve your financial goals
        </p>
      </section>

      {/* Category Navigation */}
      <section className={styles.categoryNav}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </section>

      {/* Features Grid */}
      <section className={styles.featuresGrid}>
        {filteredFeatures.map((feature, index) => (
          <Link to={feature.path} key={index} className={styles.featureCard} style={{ background: feature.gradient }}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className={styles.featureLink}>
              Learn More <FaArrowRight />
            </div>
          </Link>
        ))}
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Transform Your Financial Life?</h2>
        <p>Join thousands of users making smarter financial decisions with our platform</p>
        <Link to='/signup' className={styles.ctaButton}>
          Get Started for Free
        </Link>
      </section>
    </div>
  )
}

export default FeaturesPage

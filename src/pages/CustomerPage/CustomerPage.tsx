import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './CustomerPage.module.css'
import CustomerHeader from '../../components/CustomerComponents/CustomerHeader/CustomerHeader'
import { FaPiggyBank, FaChartLine, FaBullseye, FaStar, FaArrowRight } from 'react-icons/fa'

const illustrationUrl =
  'https://www.wealthmorning.com/wp-content/uploads/2020/02/Money-Cash-Growth-Savings-Wealth-scaled.jpg'

const features = [
  {
    icon: <FaPiggyBank size={36} color='#1abc9c' />,
    title: 'Smart Budgeting',
    description:
      'AI-powered budget suggestions and real-time expense tracking to help you make smarter financial decisions.',
    gradient: 'linear-gradient(135deg,var(--primary-color) 0%, #16a085 100%)'
  },
  {
    icon: <FaChartLine size={36} color='#3498db' />,
    title: 'Financial Insights',
    description: 'Get detailed analytics and insights about your spending patterns and financial health.',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
  },
  {
    icon: <FaBullseye size={36} color='#f39c12' />,
    title: 'Goal Tracking',
    description: 'Set and track your financial goals with personalized recommendations and progress updates.',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)'
  }
]

const testimonials = [
  {
    quote: 'This app has completely transformed how I manage my finances. The insights are incredibly helpful!',
    author: 'Sarah Johnson',
    role: 'Small Business Owner',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 5
  },
  {
    quote: 'The budget suggestions are spot-on, and the interface is so intuitive. Highly recommended!',
    author: 'Michael Chen',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 5
  },
  {
    quote: 'Finally, a financial app that actually helps me save money. The goal tracking feature is amazing!',
    author: 'Emily Rodriguez',
    role: 'Marketing Manager',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    rating: 5
  }
]

const CustomerPage: React.FC = () => {
  const location = useLocation()
  const isFeaturePage = location.pathname !== '/customer'
  const navigate = useNavigate()
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const nextTestimonial = () => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)
  const prevTestimonial = () => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)

  return (
    <div className={`${styles.customerPage} ${isVisible ? styles.visible : ''}`}>
      <CustomerHeader />

      {!isFeaturePage ? (
        <>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Take Control of Your <span className={styles.highlight}>Financial Future</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Join thousands of users making smarter financial decisions with our AI-powered personal finance
                platform.
              </p>
              <div className={styles.ctaGroup}>
                <button className={styles.ctaButton} onClick={() => navigate('/signup')}>
                  Get Started for Free
                  <FaArrowRight className={styles.ctaIcon} />
                </button>
                <button className={styles.secondaryButton} onClick={() => navigate('/customer/features')}>
                  Learn More
                </button>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.illustrationWrapper}>
                <img src={illustrationUrl} alt='Finance Illustration' className={styles.illustration} />
                <div className={styles.floatingCard}>
                  <FaChartLine className={styles.floatingIcon} />
                  <span>Track your progress</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className={styles.featuresSection}>
            {features.map((feature, idx) => (
              <div className={styles.featureCard} key={idx} style={{ background: feature.gradient }}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </section>

          {/* Testimonials Carousel */}
          <section className={styles.testimonialsSection}>
            <h2>What Our Users Say</h2>
            <div className={styles.testimonialCarousel}>
              <button className={styles.carouselNav} onClick={prevTestimonial} aria-label='Previous testimonial'>
                &lt;
              </button>
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialContent}>
                  <img
                    src={testimonials[testimonialIndex].image}
                    alt={testimonials[testimonialIndex].author}
                    className={styles.testimonialAvatar}
                  />
                  <div className={styles.testimonialStars}>
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                      <FaStar key={i} className={styles.starIcon} />
                    ))}
                  </div>
                  <p className={styles.testimonialQuote}>"{testimonials[testimonialIndex].quote}"</p>
                  <div className={styles.testimonialAuthor}>
                    <h4>{testimonials[testimonialIndex].author}</h4>
                    <span>{testimonials[testimonialIndex].role}</span>
                  </div>
                </div>
              </div>
              <button className={styles.carouselNav} onClick={nextTestimonial} aria-label='Next testimonial'>
                &gt;
              </button>
            </div>
          </section>

          {/* Animated CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2>Ready to Transform Your Financial Life?</h2>
              <p>
                Join our community of smart financial planners and start your journey towards financial freedom today.
              </p>
              <button className={styles.ctaButtonLarge} onClick={() => navigate('/signup')}>
                Get Started for Free
                <FaArrowRight className={styles.ctaIcon} />
              </button>
            </div>
          </section>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default CustomerPage

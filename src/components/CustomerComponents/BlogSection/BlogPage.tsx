import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaCalendarAlt, FaUser, FaTag, FaArrowRight } from 'react-icons/fa'
import styles from './BlogPage.module.css'

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: '10 Essential Financial Habits for 2024',
    excerpt: 'Discover the key financial habits that will help you achieve your money goals in the new year.',
    category: 'Financial Tips',
    author: 'Sarah Johnson',
    date: 'March 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Understanding Investment Strategies for Beginners',
    excerpt: 'A comprehensive guide to help you start your investment journey with confidence.',
    category: 'Investing',
    author: 'Michael Chen',
    date: 'March 12, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'How to Build an Emergency Fund',
    excerpt: 'Learn the importance of having an emergency fund and how to build one effectively.',
    category: 'Savings',
    author: 'Emily Rodriguez',
    date: 'March 10, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Smart Budgeting Techniques for Families',
    excerpt: 'Practical budgeting strategies to help families manage their finances better.',
    category: 'Budgeting',
    author: 'David Wilson',
    date: 'March 8, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
]

const categories = ['All Posts', 'Financial Tips', 'Investing', 'Savings', 'Budgeting', 'Retirement']

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Posts')

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={styles.blogPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Financial Insights & Tips</h1>
        <p>Stay informed with the latest financial news, tips, and strategies</p>
      </section>

      {/* Search and Filter Section */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type='text'
            placeholder='Search articles...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={styles.blogGrid}>
        {filteredPosts.map((post) => (
          <article key={post.id} className={styles.blogCard}>
            <div className={styles.imageContainer}>
              <img src={post.image} alt={post.title} />
              <span className={styles.category}>{post.category}</span>
            </div>
            <div className={styles.content}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className={styles.meta}>
                <span>
                  <FaUser /> {post.author}
                </span>
                <span>
                  <FaCalendarAlt /> {post.date}
                </span>
                <span>
                  <FaTag /> {post.readTime}
                </span>
              </div>
              <Link to={`/customer/blog/${post.id}`} className={styles.readMore}>
                Read More <FaArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Stay Updated with Our Newsletter</h2>
          <p>Get the latest financial tips and insights delivered to your inbox</p>
          <form className={styles.newsletterForm}>
            <input type='email' placeholder='Enter your email' />
            <button type='submit'>Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default BlogPage

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaCalendarAlt, FaUser, FaTag, FaArrowRight } from 'react-icons/fa'
import styles from './BlogPage.module.css'

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
}

// Sample blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Thói Quen Tài Chính Cần Thiết Cho Năm 2024',
    excerpt: 'Khám phá những thói quen tài chính quan trọng sẽ giúp bạn đạt được mục tiêu tiền bạc trong năm mới.',
    category: 'Mẹo Tài Chính',
    author: 'Sarah Johnson',
    date: '15 Tháng 3, 2024',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Hiểu Về Chiến Lược Đầu Tư Cho Người Mới Bắt Đầu',
    excerpt: 'Hướng dẫn toàn diện giúp bạn bắt đầu hành trình đầu tư với sự tự tin.',
    category: 'Đầu Tư',
    author: 'Michael Chen',
    date: '12 Tháng 3, 2024',
    readTime: '8 phút đọc',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Cách Xây Dựng Quỹ Khẩn Cấp',
    excerpt: 'Tìm hiểu tầm quan trọng của việc có quỹ khẩn cấp và cách xây dựng nó hiệu quả.',
    category: 'Tiết Kiệm',
    author: 'Emily Rodriguez',
    date: '10 Tháng 3, 2024',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Kỹ Thuật Lập Ngân Sách Thông Minh Cho Gia Đình',
    excerpt: 'Chiến lược lập ngân sách thực tế giúp các gia đình quản lý tài chính tốt hơn.',
    category: 'Ngân Sách',
    author: 'David Wilson',
    date: '8 Tháng 3, 2024',
    readTime: '7 phút đọc',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
]

const categories = ['Tất Cả Bài Viết', 'Mẹo Tài Chính', 'Đầu Tư', 'Tiết Kiệm', 'Ngân Sách', 'Hưu Trí']

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả Bài Viết')

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Tất Cả Bài Viết' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={styles.blogPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Thông Tin & Mẹo Tài Chính</h1>
        <p>Cập nhật tin tức, mẹo và chiến lược tài chính mới nhất</p>
      </section>

      {/* Search and Filter Section */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type='text'
            placeholder='Tìm kiếm bài viết...'
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
                Đọc Thêm <FaArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Đăng Ký Nhận Bản Tin</h2>
          <p>Nhận các mẹo và thông tin tài chính mới nhất qua email</p>
          <form className={styles.newsletterForm}>
            <input type='email' placeholder='Nhập email của bạn' />
            <button type='submit'>Đăng Ký</button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default BlogPage

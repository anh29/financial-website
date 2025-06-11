import React, { useState, useEffect } from 'react'
import { Card, Badge, LoadingSpinner } from '../../../common'
import styles from './BlogDetail.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { blogPosts, BlogPost } from '../BlogPage'

export const BlogDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('Invalid post ID')
      setIsLoading(false)
      return
    }

    // Simulate loading
    setIsLoading(true)
    const foundPost = blogPosts.find((post) => post.id === Number(id))
    if (!foundPost) {
      setError('Post not found')
    } else {
      setPost(foundPost)
    }
    setIsLoading(false)
  }, [id])

  if (error) {
    return (
      <div className={styles.blogDetailPage}>
        <div className={styles.blogDetailContainer}>
          <button onClick={() => navigate('/customer/blog')}>← Back to Blog</button>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.blogDetailPage}>
      <div className={styles.blogDetailContainer}>
        <button onClick={() => navigate('/customer/blog')}>← Back to Blog</button>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : post ? (
          <Card className={styles.blogContent}>
            <div className={styles.blogHeader}>
              <h1>{post.title}</h1>
              <div className={styles.blogMeta}>
                <Badge variant='primary'>{post.category}</Badge>
                <span>{post.date}</span>
                <span>By {post.author}</span>
              </div>
            </div>

            <div className={styles.blogImage}>
              <img src={post.image} alt={post.title} />
            </div>

            <div className={styles.blogBody}>{post.excerpt}</div>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

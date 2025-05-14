import React from 'react'
import { Card, Button, Badge, LoadingSpinner } from '../../../common'
import styles from './BlogDetail.module.css'

interface BlogDetailProps {
  post: {
    id: string
    title: string
    content: string
    date: string
    category: string
    author: string
    image: string
  }
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ post }) => {
  const isLoading = false

  return (
    <div className={styles.blogDetailPage}>
      <div className={styles.blogDetailContainer}>
        <Button variant='outline' onClick={() => window.history.back()}>
          ← Back to Blog
        </Button>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size='large' />
          </div>
        ) : (
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

            <div className={styles.blogBody}>{post.content}</div>
          </Card>
        )}
      </div>
    </div>
  )
}

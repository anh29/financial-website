import { Card, Button, LoadingSpinner, Badge } from '../../common'
import styles from './Blog.module.css'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Cách quản lý chi tiêu hiệu quả trong năm 2024',
    excerpt: 'Khám phá các phương pháp quản lý chi tiêu thông minh và hiệu quả trong năm mới...',
    author: 'Nguyễn Văn A',
    date: '15/03/2024',
    category: 'Quản lý tài chính',
    image: 'https://cafebiz.cafebizcdn.vn/162123310254002176/2024/1/15/nguyen-tac-50-20-30-17052893942471541324001.jpeg'
  },
  {
    id: 2,
    title: '5 xu hướng đầu tư nổi bật năm 2024',
    excerpt: 'Tìm hiểu về các xu hướng đầu tư mới và tiềm năng trong năm 2024...',
    author: 'Trần Thị B',
    date: '10/03/2024',
    category: 'Đầu tư',
    image: 'https://images2.thanhnien.vn/528068263637045248/2024/2/2/image1-17068599485261599068681.png'
  },
  {
    id: 3,
    title: 'Tạo quỹ khẩn cấp: Bí quyết tài chính bền vững',
    excerpt:
      'Không ai muốn điều xấu xảy ra, nhưng chuẩn bị là khôn ngoan. Cùng khám phá cách tạo quỹ dự phòng hiệu quả...',
    author: 'Lê Hoàng',
    date: '05/03/2024',
    category: 'Quản lý cá nhân',
    image: 'https://www.homecredit.vn/upload/1_co_mot_quy_du_phong_tai_chinh_la_dieu_quan_trong_c7cbb9427f.jpg'
  }
]

export const Blog = () => {
  const isLoading = false
  const posts = blogPosts

  return (
    <div className={styles.blogPage}>
      <div className={styles.blogContainer}>
        <div className={styles.blogHeader}>
          <h1>Latest Articles</h1>
          <p className={styles.subtitle}>Stay updated with our latest insights and tips</p>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {posts.map((post) => (
              <Card key={post.id} className={styles.blogCard}>
                <div className={styles.blogImage}>
                  <img src={post.image} alt={post.title} />
                </div>
                <div className={styles.blogContent}>
                  <div className={styles.blogMeta}>
                    <Badge variant='primary'>{post.category}</Badge>
                    <span>{post.date}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <Button variant='outline'>Read More</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

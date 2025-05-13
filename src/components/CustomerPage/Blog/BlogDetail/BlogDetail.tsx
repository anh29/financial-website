import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './BlogDetail.module.css'
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaShare, FaBookmark } from 'react-icons/fa'

interface BlogPost {
  id: number
  title: string
  content: string
  author: string
  date: string
  category: string
  image: string
  readTime: string
  tags: string[]
}

const BlogDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // This would typically come from an API or database
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Cách quản lý chi tiêu hiệu quả trong năm 2024',
      content: `
        <p>Quản lý chi tiêu hiệu quả là một kỹ năng quan trọng trong cuộc sống hiện đại. Dưới đây là những phương pháp giúp bạn quản lý tài chính tốt hơn:</p>
  
        <h2>1. Lập kế hoạch chi tiêu</h2>
        <p>Việc lập kế hoạch chi tiêu giúp bạn kiểm soát được dòng tiền và tránh chi tiêu quá mức. Hãy chia chi tiêu thành các danh mục:</p>
        <ul>
          <li>Chi tiêu cố định (tiền nhà, điện nước, internet)</li>
          <li>Chi tiêu linh hoạt (ăn uống, giải trí)</li>
          <li>Tiết kiệm và đầu tư</li>
        </ul>
  
        <h2>2. Sử dụng công nghệ</h2>
        <p>Ứng dụng quản lý tài chính như Vang Du’ giúp bạn:</p>
        <ul>
          <li>Theo dõi chi tiêu tự động</li>
          <li>Phân tích xu hướng chi tiêu</li>
          <li>Nhận cảnh báo khi chi tiêu vượt ngân sách</li>
        </ul>
  
        <h2>3. Đầu tư thông minh</h2>
        <p>Đầu tư là cách hiệu quả để tăng trưởng tài sản. Các hình thức đầu tư phổ biến:</p>
        <ul>
          <li>Gửi tiết kiệm ngân hàng</li>
          <li>Đầu tư chứng khoán</li>
          <li>Đầu tư bất động sản</li>
        </ul>
  
        <h2>4. Tạo quỹ dự phòng</h2>
        <p>Luôn duy trì một khoản tiền dự phòng cho các trường hợp khẩn cấp. Quỹ dự phòng nên bằng 3–6 tháng chi tiêu cơ bản.</p>
  
        <h2>5. Theo dõi và điều chỉnh</h2>
        <p>Thường xuyên xem xét và điều chỉnh kế hoạch tài chính của bạn để phù hợp với mục tiêu và hoàn cảnh hiện tại.</p>
      `,
      author: 'Nguyễn Văn A',
      date: '15/03/2024',
      category: 'Quản lý tài chính',
      image:
        'https://cafebiz.cafebizcdn.vn/162123310254002176/2024/1/15/nguyen-tac-50-20-30-17052893942471541324001.jpeg',
      readTime: '5 phút',
      tags: ['Quản lý tài chính', 'Ngân sách', 'Chi tiêu cá nhân']
    },
    {
      id: 2,
      title: '5 xu hướng đầu tư nổi bật năm 2024',
      content: `
        <p>Đầu tư ngày càng trở nên quan trọng với giới trẻ Việt Nam. Dưới đây là 5 xu hướng nổi bật năm 2024:</p>
  
        <h2>1. Đầu tư ESG (bền vững)</h2>
        <p>Nhà đầu tư trẻ ưu tiên các doanh nghiệp có trách nhiệm với xã hội và môi trường.</p>
  
        <h2>2. Cổ phiếu công nghệ AI</h2>
        <p>AI tiếp tục bùng nổ. Các công ty AI đang được định giá cao nhờ ứng dụng trong mọi lĩnh vực.</p>
  
        <h2>3. Bất động sản nghỉ dưỡng vùng ven</h2>
        <p>Khi xu hướng sống chậm lan rộng, nhà vùng ven trở thành kênh đầu tư mới.</p>
  
        <h2>4. Tiền điện tử ổn định (Stablecoins)</h2>
        <p>Dù biến động, stablecoins lại nổi bật vì khả năng bảo toàn giá trị.</p>
  
        <h2>5. Tích lũy vàng kỹ thuật số</h2>
        <p>Các nền tảng như SJC, ACB phát triển dịch vụ mua vàng trực tuyến an toàn, tiện lợi.</p>
      `,
      author: 'Trần Thị B',
      date: '10/03/2024',
      category: 'Đầu tư',
      image: 'https://images2.thanhnien.vn/528068263637045248/2024/2/2/image1-17068599485261599068681.png',
      readTime: '4 phút',
      tags: ['Đầu tư', 'Thị trường', 'Xu hướng tài chính']
    },
    {
      id: 3,
      title: 'Tạo quỹ khẩn cấp: Bí quyết tài chính bền vững',
      content: `
        <p>Quỹ khẩn cấp là khoản tiền dùng để đối phó với các tình huống không lường trước như bệnh tật, thất nghiệp hoặc tai nạn.</p>
  
        <h2>1. Vì sao cần quỹ khẩn cấp?</h2>
        <p>Không ai đoán trước được tương lai. Có quỹ khẩn cấp giúp bạn không bị áp lực tài chính đột ngột.</p>
  
        <h2>2. Bao nhiêu là đủ?</h2>
        <p>Chuyên gia tài chính khuyên bạn nên để ra từ 3 đến 6 tháng chi phí sinh hoạt cơ bản.</p>
  
        <h2>3. Nơi giữ tiền an toàn</h2>
        <ul>
          <li>Tài khoản tiết kiệm lãi suất linh hoạt</li>
          <li>Ví điện tử có liên kết ngân hàng</li>
          <li>Tài khoản không kỳ hạn (rút nhanh)</li>
        </ul>
  
        <h2>4. Bắt đầu từ đâu?</h2>
        <p>Bắt đầu nhỏ – chỉ 500.000đ/tháng cũng giúp bạn tạo quỹ 6 triệu trong năm đầu.</p>
      `,
      author: 'Lê Hoàng',
      date: '05/03/2024',
      category: 'Quản lý cá nhân',
      image: 'https://www.homecredit.vn/upload/1_co_mot_quy_du_phong_tai_chinh_la_dieu_quan_trong_c7cbb9427f.jpg',
      readTime: '4 phút',
      tags: ['Tài chính cá nhân', 'Quỹ dự phòng', 'An toàn tài chính']
    }
  ]

  const blogPost = blogPosts.find((post) => post.id === parseInt(id || '0'))

  if (!blogPost) {
    return <div>Bài viết không tồn tại</div>
  }

  return (
    <div className={styles.blogDetailContainer}>
      <button className={styles.backButton} onClick={() => navigate('/customer/blog')}>
        <FaArrowLeft /> Quay lại
      </button>

      <article className={styles.blogContent}>
        <header className={styles.blogHeader}>
          <div className={styles.blogMeta}>
            <span>
              <FaUser /> {blogPost.author}
            </span>
            <span>
              <FaCalendarAlt /> {blogPost.date}
            </span>
            <span>
              <FaTag /> {blogPost.category}
            </span>
            <span>{blogPost.readTime} đọc</span>
          </div>
          <h1>{blogPost.title}</h1>
        </header>

        <div className={styles.blogImage}>
          <img src={blogPost.image} alt={blogPost.title} />
        </div>

        <div className={styles.blogActions}>
          <button className={styles.actionButton}>
            <FaShare /> Chia sẻ
          </button>
          <button className={styles.actionButton}>
            <FaBookmark /> Lưu bài viết
          </button>
        </div>

        <div className={styles.blogBody} dangerouslySetInnerHTML={{ __html: blogPost.content }} />

        <div className={styles.blogTags}>
          {blogPost.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.relatedPosts}>
          <h2>Bài viết liên quan</h2>
          <div className={styles.relatedGrid}>{/* Add related posts here */}</div>
        </div>
      </article>
    </div>
  )
}

export default BlogDetail

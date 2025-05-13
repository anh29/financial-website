import React, { useState } from 'react'
import styles from './Feedback.module.css'
import { FaStar, FaSmile, FaMeh, FaFrown } from 'react-icons/fa'

interface FeedbackForm {
  rating: number
  category: string
  message: string
}

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackForm>({
    rating: 0,
    category: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle feedback submission
    console.log('Feedback submitted:', feedback)
  }

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <FaSmile className={styles.ratingIcon} />
    if (rating >= 2) return <FaMeh className={styles.ratingIcon} />
    return <FaFrown className={styles.ratingIcon} />
  }

  return (
    <div className={styles.feedbackContainer}>
      <h1>Góp ý của bạn</h1>
      <p className={styles.subtitle}>Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện dịch vụ</p>

      <form onSubmit={handleSubmit} className={styles.feedbackForm}>
        <div className={styles.ratingSection}>
          <h3>Bạn đánh giá trải nghiệm của mình như thế nào?</h3>
          <div className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                className={`${styles.starButton} ${feedback.rating >= star ? styles.active : ''}`}
                onClick={() => setFeedback({ ...feedback, rating: star })}
              >
                <FaStar />
              </button>
            ))}
          </div>
          {feedback.rating > 0 && (
            <div className={styles.ratingFeedback}>
              {getRatingIcon(feedback.rating)}
              <span>
                {feedback.rating >= 4 ? 'Tuyệt vời!' : feedback.rating >= 2 ? 'Cần cải thiện' : 'Không hài lòng'}
              </span>
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='category'>Loại góp ý</label>
          <select
            id='category'
            value={feedback.category}
            onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
            required
          >
            <option value=''>Chọn loại góp ý</option>
            <option value='feature'>Tính năng mới</option>
            <option value='bug'>Báo lỗi</option>
            <option value='improvement'>Cải thiện</option>
            <option value='other'>Khác</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='message'>Nội dung góp ý</label>
          <textarea
            id='message'
            value={feedback.message}
            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
            rows={5}
            placeholder='Hãy chia sẻ chi tiết góp ý của bạn...'
            required
          />
        </div>

        <button type='submit' className={styles.submitButton}>
          Gửi góp ý
        </button>
      </form>
    </div>
  )
}

export default Feedback

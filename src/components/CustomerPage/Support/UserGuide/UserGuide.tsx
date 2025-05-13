import React from 'react'
import styles from './UserGuide.module.css'
import { FaBook, FaChartLine, FaCog, FaBell } from 'react-icons/fa'

interface GuideSection {
  title: string
  icon: React.ReactNode
  steps: string[]
}

const UserGuide: React.FC = () => {
  const guideSections: GuideSection[] = [
    {
      title: 'Bắt đầu',
      icon: <FaBook />,
      steps: [
        'Đăng ký tài khoản FINEbank.IO',
        'Xác minh email của bạn',
        'Kết nối tài khoản ngân hàng',
        'Thiết lập ngân sách ban đầu'
      ]
    },
    {
      title: 'Theo dõi chi tiêu',
      icon: <FaChartLine />,
      steps: ['Xem tổng quan chi tiêu', 'Phân loại giao dịch', 'Tạo danh mục tùy chỉnh', 'Xem báo cáo chi tiết']
    },
    {
      title: 'Cài đặt',
      icon: <FaCog />,
      steps: ['Tùy chỉnh thông báo', 'Thiết lập ngân sách', 'Quản lý danh mục', 'Cài đặt bảo mật']
    },
    {
      title: 'Thông báo',
      icon: <FaBell />,
      steps: ['Nhận cảnh báo chi tiêu', 'Thiết lập giới hạn', 'Nhận báo cáo định kỳ', 'Quản lý thông báo']
    }
  ]

  return (
    <div className={styles.guideContainer}>
      <h1>Hướng dẫn sử dụng</h1>
      <div className={styles.guideGrid}>
        {guideSections.map((section, index) => (
          <div key={index} className={styles.guideSection}>
            <div className={styles.sectionHeader}>
              {section.icon}
              <h2>{section.title}</h2>
            </div>
            <ol className={styles.stepsList}>
              {section.steps.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserGuide

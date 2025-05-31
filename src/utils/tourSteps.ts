import { PopoverContentProps, Position } from '@reactour/tour'
import { useNavigate } from 'react-router-dom'

type TourStep = {
  selector: string
  content?: string | React.ReactElement | ((props: PopoverContentProps) => void)
  position?: Position
  action?: () => void
  data?: {
    tip: string
    title: string
    description: string
  }
}

export const createTourSteps = (navigate: ReturnType<typeof useNavigate>): TourStep[] => [
  // Welcome and Navigation
  {
    selector: '[data-tour="sidebar"]',
    position: 'right' as Position,
    action: () => navigate('/'),
    data: {
      tip: 'Thanh điều hướng',
      title: '👋 Chào mừng đến với FinanceHub!',
      description: 'Đây là thanh điều hướng chính, nơi bạn có thể truy cập tất cả các tính năng của ứng dụng.'
    }
  },
  // Home Page
  {
    selector: '.quick-actions',
    position: 'bottom' as Position,
    action: () => navigate('/'),
    data: {
      tip: 'Thao tác nhanh',
      title: '⚡ Truy cập nhanh',
      description:
        'Các thao tác nhanh giúp bạn truy cập nhanh vào các tính năng quan trọng như giao dịch, ngân sách, mục tiêu và hóa đơn sắp tới.'
    }
  },
  // Transactions Section
  {
    selector: '[data-tour="menu-transactions"]',
    position: 'right' as Position,
    action: () => navigate('/transactions'),
    data: {
      tip: 'Giao dịch',
      title: '💸 Quản lý giao dịch',
      description: 'Đây là mục Giao dịch. Nhấp vào đây để quản lý tất cả các giao dịch tài chính của bạn.'
    }
  },
  {
    selector: '.transaction-filters',
    position: 'top' as Position,
    action: () => navigate('/transactions'),
    data: {
      tip: 'Bộ lọc',
      title: '🔍 Tìm kiếm giao dịch',
      description: 'Sử dụng các bộ lọc này để tìm kiếm giao dịch theo ngày, danh mục hoặc số tiền.'
    }
  },
  {
    selector: '.transactions-section',
    position: 'top' as Position,
    action: () => navigate('/transactions'),
    data: {
      tip: 'Danh sách giao dịch',
      title: '📊 Trung tâm giao dịch',
      description: 'Đây là trung tâm giao dịch của bạn. Bạn có thể xem và quản lý tất cả các giao dịch tài chính.'
    }
  },
  {
    selector: '.add-button',
    position: 'bottom' as Position,
    action: () => navigate('/transactions'),
    data: {
      tip: 'Thêm mới',
      title: '➕ Thêm giao dịch',
      description: 'Nhấp vào đây để thêm giao dịch mới vào hệ thống.'
    }
  },
  // Expenses Section
  {
    selector: '[data-tour="menu-expenses"]',
    position: 'right' as Position,
    action: () => navigate('/expenses'),
    data: {
      tip: 'Chi tiêu',
      title: '💸 Quản lý chi tiêu',
      description: 'Đây là mục Chi tiêu. Nhấp vào đây để quản lý tất cả các chi tiêu của bạn.'
    }
  },
  {
    selector: '[data-tour="expenses-page"]',
    position: 'left' as Position,
    action: () => navigate('/expenses'),
    data: {
      tip: 'Trang chi tiêu',
      title: '📊 Tổng quan chi tiêu',
      description: 'Đây là trang Chi tiêu của bạn. Bạn có thể xem tổng quan, phân tích và danh sách chi tiêu.'
    }
  },
  // Upcoming Bills Section
  {
    selector: '[data-tour="menu-upcoming"]',
    position: 'right' as Position,
    action: () => navigate('/upcoming'),
    data: {
      tip: 'Hóa đơn',
      title: '📅 Hóa đơn sắp tới',
      description: 'Hãy kiểm tra phần Hóa đơn sắp tới. Nhấp vào đây để quản lý các khoản thanh toán trong tương lai.'
    }
  },
  {
    selector: '[data-tour="upcoming-section"]',
    position: 'left' as Position,
    action: () => navigate('/upcoming'),
    data: {
      tip: 'Theo dõi',
      title: '📝 Quản lý hóa đơn',
      description: 'Theo dõi các khoản thanh toán và hóa đơn sắp tới của bạn tại đây.'
    }
  },
  // Budget Section
  {
    selector: '[data-tour="menu-budget"]',
    position: 'right' as Position,
    action: () => navigate('/budget'),
    data: {
      tip: 'Ngân sách',
      title: '💰 Quản lý ngân sách',
      description: 'Tiếp theo, hãy xem phần Ngân sách. Nhấp vào đây để quản lý ngân sách của bạn.'
    }
  },
  {
    selector: '[data-tour="budget-page"]',
    position: 'left' as Position,
    action: () => navigate('/budget'),
    data: {
      tip: 'Trang ngân sách',
      title: '📈 Quản lý ngân sách',
      description:
        'Chào mừng đến với Quản lý Ngân sách! Tại đây bạn có thể tạo và quản lý ngân sách cho các danh mục chi tiêu khác nhau.'
    }
  },
  {
    selector: '.budget-progress',
    position: 'top' as Position,
    data: {
      tip: 'Tiến độ',
      title: '📊 Theo dõi ngân sách',
      description:
        'Theo dõi tiến độ chi tiêu của bạn so với giới hạn ngân sách. Màu xanh lá có nghĩa là bạn đang trong ngân sách, màu đỏ có nghĩa là bạn đã vượt quá.'
    }
  },
  // Goals Section
  {
    selector: '[data-tour="menu-goal"]',
    position: 'right' as Position,
    action: () => navigate('/goal'),
    data: {
      tip: 'Mục tiêu',
      title: '🎯 Mục tiêu tài chính',
      description: 'Hãy xem phần Mục tiêu. Nhấp vào đây để thiết lập và theo dõi các mục tiêu tài chính của bạn.'
    }
  },
  {
    selector: '.goals-section',
    position: 'left' as Position,
    action: () => navigate('/goal'),
    data: {
      tip: 'Danh sách mục tiêu',
      title: '✨ Quản lý mục tiêu',
      description:
        'Thiết lập và theo dõi các mục tiêu tài chính của bạn tại đây. Cho dù là tiết kiệm để mua nhà hay trả nợ, chúng tôi sẽ giúp bạn đạt được mục tiêu.'
    }
  },
  {
    selector: '.goal-progress',
    position: 'top' as Position,
    action: () => navigate('/goal'),
    data: {
      tip: 'Tiến độ',
      title: '📈 Theo dõi mục tiêu',
      description:
        'Theo dõi tiến độ của bạn đối với từng mục tiêu. Thanh tiến trình cho thấy bạn đã gần đến mục tiêu đến mức nào.'
    }
  },
  // Settings Section
  {
    selector: '[data-tour="menu-settings"]',
    position: 'right' as Position,
    action: () => navigate('/settings'),
    data: {
      tip: 'Cài đặt',
      title: '⚙️ Tùy chỉnh',
      description: 'Cuối cùng, hãy xem phần Cài đặt. Nhấp vào đây để tùy chỉnh trải nghiệm của bạn.'
    }
  },
  {
    selector: '.profile-settings',
    position: 'top' as Position,
    action: () => navigate('/settings'),
    data: {
      tip: 'Hồ sơ',
      title: '👤 Thông tin cá nhân',
      description: 'Cập nhật thông tin cá nhân và tùy chọn của bạn.'
    }
  },
  {
    selector: '.notification-settings',
    position: 'bottom' as Position,
    action: () => navigate('/settings'),
    data: {
      tip: 'Thông báo',
      title: '🔔 Cài đặt thông báo',
      description: 'Cấu hình cách và thời điểm bạn nhận thông báo về tài chính của mình.'
    }
  }
]

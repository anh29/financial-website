import styles from './Header.module.css'
import { useAuth } from '../../context/AuthContext'
import { generateAvatar } from '../../utils/userUtils'
import { FaQuestionCircle } from 'react-icons/fa'
import { useTourControl } from '../../utils/tourContext'

const Header = ({ className }: { className?: string }) => {
  const { user } = useAuth()
  const { setTourState, isTourActive } = useTourControl()

  const handleTourToggle = () => {
    setTourState(!isTourActive)
  }

  return (
    <header className={`${styles.headerContainer} ${className}`}>
      <div className={styles.headerLeft}>
        <h1>Xin chào {user?.username || 'Khách'}</h1>
        <span>{new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className={styles.headerRight}>
        <button
          onClick={handleTourToggle}
          title={isTourActive ? 'Tắt hướng dẫn' : 'Bật hướng dẫn'}
          aria-label={isTourActive ? 'Tắt hướng dẫn' : 'Bật hướng dẫn'}
        >
          <FaQuestionCircle />
          <span className={styles.tourButtonText}>{isTourActive ? 'Tắt hướng dẫn' : 'Bật hướng dẫn'}</span>
        </button>
        <div className={styles.userProfile}>
          {user && (
            <>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username || 'User avatar'} />
              ) : (
                <div className={styles.avatarStyle}>{generateAvatar(user.username || '')}</div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

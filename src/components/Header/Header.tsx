import styles from './Header.module.css'
import { useAuth } from '../../context/AuthContext'
import { generateAvatar } from '../../utils/userUtils'

const Header = ({ className }: { className?: string }) => {
  const { user } = useAuth()

  return (
    <header className={`${styles.headerContainer} ${className}`}>
      <div className={styles.headerLeft}>
        <h1>Xin chào {user && user.username}</h1>
        <span>{new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.userProfile}>
          {user && (
            <>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} style={{ width: '40px', borderRadius: '50%' }} />
              ) : (
                <div className={styles.avatarStyle}>{generateAvatar(user.username)}</div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

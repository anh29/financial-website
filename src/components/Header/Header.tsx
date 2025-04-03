import styles from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext'
import { generateAvatar } from '../../utils/userUtils'

const Header = ({ className }: { className?: string }) => {
  const { user } = useAuth()

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.headerLeft}>
        <h1>Hello {user && user.username}</h1>
        <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className={styles.headerRight}>
        <input type='text' placeholder='Search here' />
        <button className={styles.notification}>
          <FontAwesomeIcon icon={faBell} />
        </button>
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

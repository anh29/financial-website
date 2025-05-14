import { Button, Badge } from '../../common'
import styles from './CustomerHeader.module.css'

export const CustomerHeader = () => {
  return (
    <header className={styles.customerHeader}>
      <div className={styles.logo}>
        <a href='/'>
          <span className={styles.logoIcon}>💰</span>
          FinancialApp
        </a>
      </div>

      <nav className={styles.navLinks}>
        <a href='/' className={styles.active}>
          Home
        </a>
        <a href='/support'>Support</a>
        <a href='/blog'>Blog</a>
      </nav>

      <div className={styles.headerActions}>
        <Button variant='outline'>Sign In</Button>
        <Button>Sign Up</Button>
        <Badge variant='primary'>New</Badge>
      </div>
    </header>
  )
}

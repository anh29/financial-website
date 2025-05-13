import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <div className={styles.breadcrumb}>
      <Link to='/customer'>Trang chủ</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        return (
          <React.Fragment key={name}>
            <span className={styles.separator}>/</span>
            {isLast ? <span className={styles.current}>{name}</span> : <Link to={routeTo}>{name}</Link>}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Breadcrumb

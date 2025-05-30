import styles from './SettingsPage.module.css'
import { useAuth } from '../../context/AuthContext'

const SettingsPage = () => {
  const { user } = useAuth()

  return (
    <div className={styles.settingsPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cài đặt tài khoản</h1>
        <p className={styles.subtitle}>Quản lý thông tin cá nhân và bảo mật</p>
      </header>
      <div className={styles.settingsGrid}>
        {/* Profile Card */}
        <section className={styles.profileCard}>
          <div className={styles.avatarSection}>
            {user && user.avatar ? (
              <img src={user.avatar} alt={user.username} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>👤</div>
            )}
          </div>
          <form className={styles.profileForm}>
            <label>
              Họ và tên
              <input type='text' defaultValue={user?.username || ''} />
            </label>
            <label>
              Email
              <input type='email' defaultValue={user?.username || ''} />
            </label>
            <button type='submit' className={styles.saveBtn}>
              Lưu thay đổi
            </button>
          </form>
        </section>

        {/* Security Section */}
        <section className={styles.securityCard}>
          <h2>Bảo mật</h2>
          <form className={styles.securityForm}>
            <label>
              Mật khẩu hiện tại
              <input type='password' autoComplete='current-password' />
            </label>
            <label>
              Mật khẩu mới
              <input type='password' autoComplete='new-password' />
            </label>
            <label>
              Xác nhận mật khẩu mới
              <input type='password' autoComplete='new-password' />
            </label>
            <button type='submit' className={styles.saveBtn}>
              Đổi mật khẩu
            </button>
          </form>
        </section>

        {/* Preferences Section */}
        <section className={styles.preferencesCard}>
          <h2>Tùy chọn</h2>
          <div className={styles.preferenceRow}>
            <span>Giao diện:</span>
            <select>
              <option>Light</option>
              <option disabled>Dark</option>
            </select>
          </div>
          <div className={styles.preferenceRow}>
            <span>Ngôn ngữ:</span>
            <select>
              <option>Tiếng Việt</option>
              <option disabled>English</option>
            </select>
          </div>
        </section>

        {/* Danger Zone */}
        <section className={styles.dangerZoneCard}>
          <h2>Khu vực nguy hiểm</h2>
          <p>Xóa tài khoản và toàn bộ dữ liệu. Hành động này không thể hoàn tác.</p>
          <button className={styles.deleteBtn}>Xóa tài khoản</button>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage

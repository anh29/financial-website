import React from 'react'
import styles from './SettingsPage.module.css'
import { useAuth } from '../../context/AuthContext'

const SettingsPage = () => {
  const { user } = useAuth()

  return (
    <div className={styles.settingsPage}>
      <h1>Account & Settings</h1>
      <p className={styles.timestamp}>4:55 pm 21 Jul 2023</p>
      <div className={styles.container}>
        <section className={styles.section}>
          <h2>Basic Details</h2>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              {user && (
                <>
                  {user.avatar ? (
                    <>
                      <img src={user.avatar} alt={user.username} style={{ width: '40px', borderRadius: '50%' }} />
                      <button className={styles.changeButton}>Change</button>
                    </>
                  ) : null}
                </>
              )}
            </div>
            <form className={styles.detailsForm}>
              <label>
                First Name:
                <input type='text' value='Emery' readOnly />
              </label>
              <label>
                Last Name:
                <input type='text' value='Kenter' readOnly />
              </label>
              <button type='button' className={styles.editButton}>
                Edit
              </button>
            </form>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Delete Profile</h2>
          <p>Delete your account and all of your source data. This is irreversible.</p>
          <button className={styles.deleteButton}>Delete Account</button>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage

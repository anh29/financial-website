import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { LoadingSpinner } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { GOOGLE_INFO_API_KEY, SERVER_ENDPOINT } from '../../utils/constants'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { User } from '../../types'

const SignInPage: React.FC = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '', remember: false })
  const [loading, setLoading] = useState(false)
  const [logData, setLogData] = useState<{ message: string; status: 'success' | 'error' | 'warning' | 'info' } | null>(
    null
  )
  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await handleGoogleAuth(tokenResponse.access_token)
    }
  })

  const handleGoogleAuth = async (accessToken: string) => {
    setLoading(true)
    try {
      const userInfo = await axios.get(GOOGLE_INFO_API_KEY, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const { name, picture, email, email_verified } = userInfo.data

      const response = await axios.post(SERVER_ENDPOINT.AUTH.SIGN_IN, {
        username: name,
        email,
        avatar: picture,
        email_verified,
        via_google: true
      })

      const userData: User = {
        id: response.data.data.id,
        email: email,
        name: name,
        username: name,
        avatar: picture,
        email_verified: email_verified,
        via_google: true
      }

      setLogData({ message: response.data.message, status: 'success' })
      login(userData)
    } catch {
      setLogData({ message: 'Lỗi khi lấy thông tin người dùng Google. Vui lòng thử lại.', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(SERVER_ENDPOINT.AUTH.SIGN_IN, formData)
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch {
      setLogData({ message: 'Đã xảy ra lỗi.', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.signInPage}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          {/* Placeholder SVG logo */}
          <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='20' cy='20' r='20' fill='#1abc9c' />
            <text x='50%' y='55%' textAnchor='middle' fill='#fff' fontSize='18' fontWeight='bold' dy='.3em'>
              F
            </text>
          </svg>
          <p>
            Finance<span>Hub</span>
          </p>
        </div>
        <div className={styles.heading}>Đăng Nhập</div>
        {logData && <div className={`${styles.feedback} ${styles[logData.status]}`}>{logData.message}</div>}
        <form onSubmit={handleSubmit} className={styles.form} autoComplete='on'>
          <div className={styles.inputWrapper}>
            <input
              type='text'
              placeholder='Tên đăng nhập'
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              autoComplete='username'
              aria-label='Tên đăng nhập'
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Mật khẩu'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete='current-password'
              aria-label='Mật khẩu'
            />
            <button
              type='button'
              className={styles.passwordToggle}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className={styles.forgotPassword}>
            <a href='/forgot-password'>Quên mật khẩu?</a>
          </div>
          <button type='submit' className={styles.button} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Đăng Nhập'}
          </button>
        </form>
        <div className={styles.divider}>hoặc đăng nhập bằng</div>
        <button type='button' className={styles.googleButton} onClick={() => handleGoogleLogin()} disabled={loading}>
          <FaGoogle style={{ fontSize: '1.2rem' }} />
          <span>Tiếp tục với Google</span>
        </button>
        <div className={styles.switchLink}>
          Chưa có tài khoản? <a href='/signup'>Đăng ký tại đây</a>
        </div>
      </div>
    </div>
  )
}

export default SignInPage

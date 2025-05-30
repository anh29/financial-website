import React, { useState } from 'react'
import styles from './SignUpPage.module.css'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { GOOGLE_INFO_API_KEY, SERVER_ENDPOINT } from '../../utils/constants'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../../components/common'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'

const SignupPage = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', terms: false })
  const [loading, setLoading] = useState(false)
  const [logData, setLogData] = useState<{ message: string; status: 'success' | 'error' | 'warning' | 'info' } | null>(
    null
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

      const response = await axios.post(SERVER_ENDPOINT.AUTH.CREATE_USER, {
        username: name,
        email,
        avatar: picture,
        email_verified,
        via_google: true
      })
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch (error) {
      setLogData({ message: `Lỗi khi lấy thông tin người dùng Google: ${error}`, status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setLogData({ message: 'Mật khẩu không khớp.', status: 'error' })
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(SERVER_ENDPOINT.AUTH.CREATE_USER, formData)
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch {
      setLogData({ message: 'Đã xảy ra lỗi.', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    formData.username && formData.email && formData.password && formData.confirmPassword && formData.terms

  return (
    <div className={styles.signUpPage}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
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
        <div className={styles.heading}>Tạo tài khoản của bạn</div>
        <div className={styles.subtitle}>Tham gia cùng chúng tôi và kiểm soát tài chính của bạn</div>
        {logData && <div className={`${styles.feedback} ${styles[logData.status]}`}>{logData.message}</div>}
        <form onSubmit={handleSubmit} className={styles.form} autoComplete='on'>
          <div className={styles.inputWrapper}>
            <input
              id='username'
              type='text'
              placeholder='Tên đăng nhập'
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete='username'
              aria-label='Tên đăng nhập'
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              id='email'
              type='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete='email'
              aria-label='Email'
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Mật khẩu'
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete='new-password'
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
          <div className={styles.inputWrapper}>
            <input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Xác nhận mật khẩu'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              autoComplete='new-password'
              aria-label='Xác nhận mật khẩu'
            />
            <button
              type='button'
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword((v) => !v)}
              tabIndex={0}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className={styles.terms}>
            <input type='checkbox' id='terms' required checked={formData.terms} onChange={handleInputChange} />
            <label htmlFor='terms'>
              Hãy đồng ý với <a href='/terms-of-service'>Điều khoản dịch vụ</a> của chúng tôi.
            </label>
          </div>
          <button type='submit' className={styles.signupButton} disabled={!isFormValid || loading}>
            {loading ? <LoadingSpinner /> : 'Đăng Ký'}
          </button>
        </form>
        <div className={styles.divider}>hoặc đăng ký bằng</div>
        <button type='button' className={styles.googleButton} onClick={() => handleGoogleLogin()} disabled={loading}>
          <FaGoogle style={{ fontSize: '1.2rem' }} />
          <span>Tiếp tục với Google</span>
        </button>
        <div className={styles.switchLink}>
          Đã có tài khoản? <a href='/signin'>Đăng nhập tại đây</a>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

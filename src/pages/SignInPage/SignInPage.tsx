import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { LoadingSpinner } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { GOOGLE_INFO_API_KEY, SERVER_ENDPOINT } from '../../utils/constants'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'

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
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch {
      setLogData({ message: 'Error fetching Google user info. Please try again.', status: 'error' })
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
      setLogData({ message: 'An error occurred.', status: 'error' })
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
        <div className={styles.heading}>Sign In</div>
        {logData && <div className={`${styles.feedback} ${styles[logData.status]}`}>{logData.message}</div>}
        <form onSubmit={handleSubmit} className={styles.form} autoComplete='on'>
          <div className={styles.inputWrapper}>
            <input
              type='text'
              placeholder='Username'
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              autoComplete='username'
              aria-label='Username'
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete='current-password'
              aria-label='Password'
            />
            <button
              type='button'
              className={styles.passwordToggle}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className={styles.forgotPassword}>
            <a href='/forgot-password'>Forgot password?</a>
          </div>
          <button type='submit' className={styles.button} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Sign In'}
          </button>
        </form>
        <div className={styles.divider}>or sign in with</div>
        <button type='button' className={styles.googleButton} onClick={() => handleGoogleLogin()} disabled={loading}>
          <FaGoogle style={{ fontSize: '1.2rem' }} />
          <span>Continue with Google</span>
        </button>
        <div className={styles.switchLink}>
          Don't have an account? <a href='/signup'>Sign up here</a>
        </div>
      </div>
    </div>
  )
}

export default SignInPage

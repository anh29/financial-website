import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import FormInput from '../../components/FormInput/FormInput'
import Button from '../../components/Button/Button'
import { SERVER_URL, GOOGLE_INFO_API_KEY } from '../../utils/constants'
import Log from '../../components/Log/Log'
import { useAuth } from '../../context/AuthContext'

const SignInPage = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })
  const [loading, setLoading] = useState(false)
  const [logData, setLogData] = useState<{ message: string; status: 'success' | 'error' | 'warning' | 'info' } | null>(
    null
  )

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

      const response = await axios.post(`${SERVER_URL}/createUser`, {
        username: name,
        email,
        avatar: picture,
        email_verified,
        via_google: true
      })
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch (error) {
      setLogData({ message: 'Error fetching Google user info. Please try again.', status: 'error' })
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
    setLoading(true)
    try {
      const response = await axios.post(`${SERVER_URL}/signin`, formData)
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch (error) {
      setLogData({ message: error.response?.data?.error || 'An error occurred.', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className={styles.signinPage}>
      {logData && <Log message={logData.message} status={logData.status} onClose={() => setLogData(null)} />}
      <div className={styles.logo}>
        <h1>Welcome Back to FINEbank.IO</h1>
        <p>Sign in to access your account</p>
      </div>
      <form className={styles.signinForm} onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {['email', 'password'].map((field) => (
          <FormInput
            key={field}
            id={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            type={field === 'password' ? 'password' : 'email'}
            placeholder={`Enter your ${field}`}
            value={formData[field as keyof typeof formData]}
            onChange={handleInputChange}
            required
            autoComplete={field}
            ariaLabel={field}
            showPasswordToggle={field === 'password'}
          />
        ))}
        <div className={styles.rememberMe}>
          <input type='checkbox' id='remember' checked={formData.remember} onChange={handleInputChange} />
          <label htmlFor='remember'>Remember me</label>
        </div>
        <div className={styles.forgotPassword}>
          <p>
            Forgot your password? <a href='/forgot-password'>Reset Password</a>
          </p>
        </div>
        <Button type='submit' className={styles.signinButton} disabled={!isFormValid || loading}>
          {loading ? 'Loading...' : 'Sign In'}
        </Button>
        <div className={styles.divider}>or sign in with</div>
        <Button type='button' className={styles.googleButton} onClick={handleGoogleLogin} disabled={loading}>
          {loading ? 'Loading...' : <>Continue with <span>Google</span></>}
        </Button>
        <p className={styles.switchLink}>
          Don't have an account? <a href='/signup'>Sign up here</a>
        </p>
      </form>
    </div>
  )
}

export default SignInPage

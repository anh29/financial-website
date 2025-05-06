import React, { useState } from 'react'
import styles from './SignupPage.module.css'
import FormInput from '../../components/FormInput/FormInput'
import Button from '../../components/Button/Button'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { GOOGLE_INFO_API_KEY, SERVER_ENDPOINT } from '../../utils/constants'
import Log from '../../components/Log/Log'
import { useAuth } from '../../context/AuthContext'

const SignupPage = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', terms: false })
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
      setLogData({ message: `Error fetching Google user info: ${error}`, status: 'error' })
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
      setLogData({ message: 'Passwords do not match.', status: 'error' })
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(SERVER_ENDPOINT.AUTH.CREATE_USER, formData)
      setLogData({ message: response.data.message, status: 'success' })
      login(response.data.data)
    } catch (error) {
      setLogData({ message: error.response?.data?.error || 'An error occurred.', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    formData.username && formData.email && formData.password && formData.confirmPassword && formData.terms

  return (
    <div className={styles.signupPage}>
      {logData && <Log message={logData.message} status={logData.status} onClose={() => setLogData(null)} />}
      <div className={styles.logo}>
        <h1>Welcome to FINEbank.IO</h1>
        <p>Join us and take control of your finances</p>
      </div>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        {['username', 'email', 'password', 'confirmPassword'].map((field) => (
          <FormInput
            key={field}
            id={field}
            label={field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
            type={field.includes('password') ? 'password' : 'text'}
            placeholder={`Enter your ${field}`}
            value={formData[field as keyof typeof formData]}
            onChange={handleInputChange}
            required
            autoComplete={field}
            ariaLabel={field}
            showPasswordToggle={field.includes('password')}
          />
        ))}
        <div className={styles.terms}>
          <input type='checkbox' id='terms' required checked={formData.terms} onChange={handleInputChange} />
          <label htmlFor='terms'>
            By continuing, you agree to our <a href='/terms-of-service'>Terms of Service</a>.
          </label>
        </div>
        <Button type='submit' className={styles.signupButton} disabled={!isFormValid || loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </Button>
        <div className={styles.divider}>or sign up with</div>
        <Button type='button' className={styles.googleButton} onClick={handleGoogleLogin} disabled={loading}>
          {loading ? (
            'Loading...'
          ) : (
            <>
              Continue with <span>Google</span>
            </>
          )}
        </Button>
        <p className={styles.switchLink}>
          Already have an account? <a href='/signin'>Sign in here</a>
        </p>
      </form>
    </div>
  )
}

export default SignupPage

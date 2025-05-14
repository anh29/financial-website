import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { Button, Card, Form, Input, LoadingSpinner } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { GOOGLE_INFO_API_KEY, SERVER_ENDPOINT } from '../../utils/constants'
import Log from '../../components/common/Log/Log'

const SignInPage: React.FC = () => {
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
      {logData && <Log message={logData.message} status={logData.status} onClose={() => setLogData(null)} />}
      <Card className={styles.signInCard}>
        <h1>Sign In</h1>
        <Form onSubmit={handleSubmit} className={styles.signInForm}>
          <Input
            label='Email'
            type='email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label='Password'
            type='password'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type='submit' fullWidth isLoading={loading}>
            Sign In
          </Button>
        </Form>
      </Card>
      <div className={styles.divider}>or sign in with</div>
      <Button type='button' className={styles.googleButton} onClick={() => handleGoogleLogin()} disabled={loading}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            Continue with <span>Google</span>
          </>
        )}
      </Button>
      <p className={styles.switchLink}>
        Don't have an account? <a href='/signup'>Sign up here</a>
      </p>
    </div>
  )
}

export default SignInPage

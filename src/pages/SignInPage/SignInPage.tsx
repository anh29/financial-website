import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import FormInput from '../../components/FormInput/FormInput'
import Button from '../../components/Button/Button'

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        })
        const { name, picture, email, email_verified } = userInfo.data

        console.log('Google User Info:', userInfo)
      } catch (error) {
        console.error('Error fetching Google user info:', error)
      }
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    })
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className={styles.signinPage}>
      <div className={styles.logo}>
        <h1>Welcome Back to FINEbank.IO</h1>
        <p>Sign in to access your account</p>
      </div>
      <form className={styles.signinForm}>
        <h2>Sign In</h2>
        <FormInput
          id='email'
          label='Email Address'
          type='email'
          placeholder='e.g., johndoe@email.com'
          value={formData.email}
          onChange={handleInputChange}
          required
          autoComplete='email'
          ariaLabel='Email Address'
        />
        <FormInput
          id='password'
          label='Password'
          type='password'
          placeholder='Enter your password'
          value={formData.password}
          onChange={handleInputChange}
          required
          autoComplete='current-password'
          ariaLabel='Password'
          showPasswordToggle={true}
        />
        <div className={styles.rememberMe}>
          <input type='checkbox' id='remember' checked={formData.remember} onChange={handleInputChange} />
          <label htmlFor='remember'>Remember me</label>
        </div>
        <div className={styles.forgotPassword}>
          <p>
            Forgot your password? <a href='/forgot-password'>Reset Password</a>
          </p>
        </div>
        <Button type='submit' className={styles.signinButton} disabled={!isFormValid}>
          Sign In
        </Button>
        <div className={styles.divider}>or sign in with</div>
        <Button type='button' className={styles.googleButton} onClick={handleGoogleLogin}>
          Continue with <span>Google</span>
        </Button>
        <p className={styles.switchLink}>
          Don't have an account? <a href='/signup'>Sign up here</a>
        </p>
      </form>
    </div>
  )
}

export default SignInPage

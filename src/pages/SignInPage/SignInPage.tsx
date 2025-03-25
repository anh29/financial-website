import React, { useState } from 'react'
import styles from './SignInPage.module.css'

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.signinPage}>
      <div className={styles.logo}>
        <h1>Welcome Back to FINEbank.IO</h1>
        <p>Sign in to access your account</p>
      </div>
      <form className={styles.signinForm}>
        <h2>Sign In</h2>
        <div className={styles.inputGroup}>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            id='email'
            placeholder='e.g., johndoe@email.com'
            required
            autoComplete='email'
            aria-label='Email Address'
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor='password'>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='Enter your password'
              required
              autoComplete='current-password'
              aria-label='Password'
            />
            <button
              type='button'
              className={styles.showPassword}
              onClick={togglePasswordVisibility}
              aria-label='Toggle password visibility'
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        <div className={styles.rememberMe}>
          <input type='checkbox' id='remember' />
          <label htmlFor='remember'>Remember me</label>
        </div>
        <div className={styles.forgotPassword}>
          <p>
            Forgot your password? <a href='/forgot-password'>Reset Password</a>
          </p>
        </div>
        <button type='submit' className={styles.signinButton}>
          Sign In
        </button>
        <div className={styles.divider}>or sign in with</div>
        <button type='button' className={styles.googleButton}>
          Continue with <span>Google</span>
        </button>
        <p className={styles.switchLink}>
          Don't have an account? <a href='/signup'>Sign up here</a>
        </p>
      </form>
    </div>
  )
}

export default SignInPage

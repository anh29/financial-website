import React, { useState } from 'react'
import styles from './SignupPage.module.css'
import FormInput from '../../components/FormInput/FormInput'
import Button from '../../components/Button/Button'

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', terms: false })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    })
  }

  const isFormValid = formData.name && formData.email && formData.password && formData.terms

  return (
    <div className={styles.signupPage}>
      <div className={styles.logo}>
        <h1>Welcome to FINEbank.IO</h1>
        <p>Join us and take control of your finances</p>
      </div>
      <form className={styles.signupForm}>
        <h2>Create your account</h2>
        <FormInput
          id='name'
          label='Name'
          type='text'
          placeholder='e.g., John Doe'
          value={formData.name}
          onChange={handleInputChange}
          required
          autoComplete='name'
          ariaLabel='Full Name'
        />
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
          placeholder='Create a strong password'
          value={formData.password}
          onChange={handleInputChange}
          required
          autoComplete='new-password'
          ariaLabel='Password'
          showPasswordToggle={true}
        />
        <div className={styles.terms}>
          <input type='checkbox' id='terms' required checked={formData.terms} onChange={handleInputChange} />
          <label htmlFor='terms'>
            By continuing, you agree to our <a href='/terms-of-service'>Terms of Service</a>.
          </label>
        </div>
        <Button type='submit' className={styles.signupButton} disabled={!isFormValid}>
          Sign Up
        </Button>
        <div className={styles.divider}>or sign up with</div>
        <Button type='button' className={styles.googleButton}>
          Continue with <span>Google</span>
        </Button>
        <p className={styles.switchLink}>
          Already have an account? <a href='/signin'>Sign in here</a>
        </p>
      </form>
    </div>
  )
}

export default SignupPage

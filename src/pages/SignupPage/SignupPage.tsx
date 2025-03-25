import React, { useState } from 'react';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.logo}>
        <h1>Welcome to FINEbank.IO</h1>
        <p>Join us and take control of your finances</p>
      </div>
      <form className={styles.signupForm}>
        <h2>Create your account</h2>
        <div className={styles.inputGroup}>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='e.g., John Doe'
            required
            autoComplete='name'
            aria-label='Full Name'
          />
        </div>
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
              placeholder='Create a strong password'
              required
              autoComplete='new-password'
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
        <div className={styles.terms}>
          <input type='checkbox' id='terms' required />
          <label htmlFor='terms'>
            By continuing, you agree to our <a href='/terms-of-service'>Terms of Service</a>.
          </label>
        </div>
        <button type='submit' className={styles.signupButton}>
          Sign Up
        </button>
        <div className={styles.divider}>or sign up with</div>
        <button type='button' className={styles.googleButton}>
          Continue with <span>Google</span>
        </button>
        <p className={styles.switchLink}>
          Already have an account? <a href='/login'>Sign in here</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;

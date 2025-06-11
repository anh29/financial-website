import React, { Component, ErrorInfo, ReactNode } from 'react'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />
    }

    return this.props.children
  }
}

const ErrorDisplay: React.FC<{ error: Error | null }> = ({ error }) => {
  const { t } = useLanguage()

  return (
    <div className={styles.errorContainer}>
      <h2>{t('common', 'errorBoundary.title')}</h2>
      <p>{t('common', 'errorBoundary.message')}</p>
      {error && <pre className={styles.errorDetails}>{error.message}</pre>}
      <button
        className={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        {t('common', 'errorBoundary.retry')}
      </button>
    </div>
  )
}

export const ErrorBoundary = ErrorBoundaryClass

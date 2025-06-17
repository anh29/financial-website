import React, { Component, ErrorInfo, ReactNode } from 'react'
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
    console.error(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />
    }

    return this.props.children
  }
}

const ErrorDisplay: React.FC<{ error: Error | null }> = ({ error }) => {
  return (
    <div className={styles.errorContainer}>
      <h2>Lỗi</h2>
      <p>Đã xảy ra lỗi khi hiển thị thành phần này.</p>
      {error && <pre className={styles.errorDetails}>{error.message}</pre>}
      <button className={styles.retryButton} onClick={() => window.location.reload()}>
        Thử lại
      </button>
    </div>
  )
}

export const ErrorBoundary = ErrorBoundaryClass

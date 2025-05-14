import React, { useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner/LoadingSpinner'
import Log from './Log/Log'

interface WithApiHandlerProps {
  loading?: boolean
  error?: string | null
}

export function withApiHandler<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithApiHandlerComponent(props: P & WithApiHandlerProps) {
    const [logMessage, setLogMessage] = useState<{
      message: string
      status: 'success' | 'error' | 'warning' | 'info'
    } | null>(null)

    const handleCloseLog = () => {
      setLogMessage(null)
    }

    if (props.error) {
      setLogMessage({ message: props.error, status: 'error' })
    }

    return (
      <div style={{ position: 'relative', minHeight: '200px' }}>
        {props.loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          >
            <LoadingSpinner />
          </div>
        )}

        {logMessage && <Log message={logMessage.message} status={logMessage.status} onClose={handleCloseLog} />}

        <div style={{ opacity: props.loading ? 0.5 : 1 }}>
          <WrappedComponent {...props} />
        </div>
      </div>
    )
  }
}

import React from 'react'
import Dashboard from './Dashboard'
import { useApi } from '../../hooks/useApi'

const DashboardPage: React.FC = () => {
  const { loading, error } = useApi()

  return (
    <div className='dashboard-page'>
      <Dashboard loading={loading} error={error} />
    </div>
  )
}

export default DashboardPage

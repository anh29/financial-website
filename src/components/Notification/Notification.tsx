import React from 'react'

const Notification = ({ message }) => {
  return (
    <div style={{ background: 'yellow', padding: '10px', margin: '10px 0' }}>
      {message}
    </div>
  )
}

export default Notification

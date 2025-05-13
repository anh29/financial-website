import React from 'react'
import './Card.css'

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isLoading?: boolean
}

const Card: React.FC<CardProps> = ({ title, children, className = '', onClick, isLoading }) => {
  return (
    <div className={`card ${className} ${onClick ? 'clickable' : ''} ${isLoading ? 'loading' : ''}`} onClick={onClick}>
      {title && <h3 className='card-title'>{title}</h3>}
      <div className='card-content'>
        {isLoading ? (
          <div className='card-loading'>
            <div className='loading-spinner' />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default Card

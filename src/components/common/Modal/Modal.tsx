import React from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.overlay}>
        <button className={styles.closeButton} onClick={onClose} aria-label='Close'>
          &times;
        </button>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

export default Modal

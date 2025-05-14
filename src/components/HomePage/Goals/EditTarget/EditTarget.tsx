import React from 'react'
import { Modal } from '../../../../components/common'
import styles from './EditTarget.module.css'

interface TargetDetails {
  target: number
  description: string
  deadline: string
}

interface EditTargetProps {
  targetDetails: TargetDetails
  setTargetDetails: (details: TargetDetails) => void
  closeModal: () => void
}

const EditTarget: React.FC<EditTargetProps> = ({ targetDetails, setTargetDetails, closeModal }) => {
  const handleSave = () => {
    console.log('Updated Target Details:', targetDetails)
    closeModal()
  }

  return (
    <Modal isOpen={true} onClose={closeModal} title='Edit Target Details'>
      <div className={styles.editTargetContent}>
        <p>Target Amount:</p>
        <input
          type='number'
          value={targetDetails.target}
          onChange={(e) => setTargetDetails({ ...targetDetails, target: Number(e.target.value) })}
          className={styles.input}
        />
      </div>
      <div className={styles.editTargetContent}>
        <p>Description:</p>
        <textarea
          value={targetDetails.description}
          onChange={(e) => setTargetDetails({ ...targetDetails, description: e.target.value })}
          className={styles.textarea}
        />
      </div>
      <div className={styles.modalContent}>
        <p>Deadline:</p>
        <input
          type='date'
          value={targetDetails.deadline}
          onChange={(e) => setTargetDetails({ ...targetDetails, deadline: e.target.value })}
          className={styles.input}
        />
      </div>
      <div className={styles.modalActions}>
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
        <button onClick={closeModal} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default EditTarget

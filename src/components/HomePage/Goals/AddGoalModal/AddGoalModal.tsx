import { useState, useEffect } from 'react'
import styles from './AddGoalModal.module.css'
import { Goals } from '../../../../types/goals'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (goal: Partial<Goals>) => void
  editGoal?: Partial<Goals> | null
}

const AddGoalModal = ({ isOpen, onClose, onSave, editGoal }: AddGoalModalProps) => {
  const [formData, setFormData] = useState<Partial<Goals>>({
    status: 'active',
    repeat_type: 'none',
    start_date: new Date().toISOString().split('T')[0],
    ...editGoal
  })

  useEffect(() => {
    if (editGoal) {
      setFormData(editGoal)
    } else {
      // Reset form when opening for new goal
      setFormData({
        status: 'active',
        repeat_type: 'none',
        start_date: new Date().toISOString().split('T')[0]
      })
    }
  }, [editGoal, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalAddGoalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{editGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type='text'
                name='description'
                value={formData.description || ''}
                onChange={handleChange}
                placeholder='Enter goal title'
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Amount</label>
              <input
                type='number'
                name='amount'
                value={formData.amount || ''}
                onChange={handleChange}
                placeholder='Enter target amount'
                required
                min='0'
              />
            </div>

            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type='date'
                name='start_date'
                value={formData.start_date || new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Target Date</label>
              <input
                type='date'
                name='target_date'
                value={formData.target_date || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Repeat Type</label>
              <select name='repeat_type' value={formData.repeat_type || 'none'} onChange={handleChange}>
                <option value='none'>None</option>
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
                <option value='yearly'>Yearly</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Status</label>
              <select name='status' value={formData.status || 'active'} onChange={handleChange}>
                <option value='active'>Active</option>
                <option value='completed'>Completed</option>
                <option value='cancelled'>Cancelled</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type='button' className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className={styles.saveBtn}>
              {editGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddGoalModal

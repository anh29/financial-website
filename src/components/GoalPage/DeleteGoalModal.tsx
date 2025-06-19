import { formatCurrency, formatDate } from '../../utils/helpers'
import styles from './DeleteGoalModal.module.css'
import { Goals } from '../../types/goals'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'

interface DeleteGoalModalProps {
  deleteStep: number
  setDeleteStep: (step: number) => void
  goal: Goals | undefined
  confirmDeleteGoal: () => void
  onClose: () => void
}

const DeleteGoalModal = ({
  deleteStep,
  setDeleteStep,
  goal,
  confirmDeleteGoal,
  onClose,
}: DeleteGoalModalProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.confirmModal}>
        <div className={styles.headerRow}>
          <FiTrash2 size={36} color="#e74c3c" className={styles.headerIcon} />
          <div>
            <div className={styles.confirmTitle}>Bạn sắp xoá mục tiêu!</div>
            <div className={styles.goalName}>{goal?.description}</div>
          </div>
        </div>
        {deleteStep === 1 ? (
          <>
            <div className={styles.infoBox}>
              <div className={styles.infoRow}><span className={styles.label}>Số tiền cần đóng:</span><span className={styles.value}>{formatCurrency(Number(goal?.amount))}</span></div>
              <div className={styles.infoRow}><span className={styles.label}>Số tiền đã đóng:</span><span className={styles.value}>{formatCurrency(Number(goal?.amount) - Number(goal?.missing_amount || 0))}</span></div>
              <div className={styles.infoRow}><span className={styles.label}>Số tiền còn lại:</span><span className={styles.value}>{formatCurrency(Number(goal?.missing_amount || 0))}</span></div>
              <div className={styles.infoRow}><span className={styles.label}>Ngày đến hạn:</span><span className={styles.value}>{formatDate(String(goal?.target_date))}</span></div>
            </div>
            <div className={styles.warningBox}>
              <FiAlertTriangle size={20} color="#e74c3c" style={{ marginRight: 8, flexShrink: 0 }} />
              <span>Hành động này <b>không thể hoàn tác</b>. Vui lòng kiểm tra kỹ thông tin trước khi xoá mục tiêu này.</span>
            </div>
            <div className={styles.buttonRow}>
              <button onClick={() => setDeleteStep(2)} className={styles.confirmBtn}>
                Tiếp tục
              </button>
              <button onClick={onClose} className={styles.cancelBtn}>
                Huỷ
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.confirmTitle} style={{ color: '#e74c3c', textAlign: 'center', marginTop: 24 }}>Xác nhận xoá mục tiêu</div>
            <div className={styles.confirmDesc} style={{ marginBottom: '2rem', textAlign: 'center' }}>
              Bạn có chắc chắn muốn xoá mục tiêu này không?
            </div>
            <div className={styles.buttonRow}>
              <button onClick={confirmDeleteGoal} className={styles.dangerBtn}>
                Xoá
              </button>
              <button onClick={() => setDeleteStep(1)} className={styles.secondaryBtn}>
                Quay lại
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DeleteGoalModal
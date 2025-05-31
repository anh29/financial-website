import { PopoverContentProps } from '@reactour/tour'
import mascotImage from '../../assets/linhvat.png'
import styles from './CustomTourContent.module.css'

type StepData = {
  data?: {
    tip?: string
    title?: string
    description?: string
    image?: string
  }
}

export const CustomTourContent = ({
  currentStep,
  steps,
  setCurrentStep,
  setIsOpen,
  setTourState
}: PopoverContentProps & { setTourState: (state: boolean) => void }) => {
  // currentStep is a number, steps[currentStep] is the step object
  const stepObj = typeof currentStep === 'number' ? steps[currentStep] : currentStep
  // Safely access data property if it exists
  const stepData = stepObj && typeof stepObj === 'object' && 'data' in stepObj ? (stepObj as StepData).data || {} : {}
  const { tip, title, description, image } = stepData

  const handleClose = () => {
    setTourState(false)
    setIsOpen(false)
  }

  return (
    <div className={styles.tourPopover}>
      <img src={image || mascotImage} alt='Mascot' className={styles.tourMascot} />
      <div className={styles.tourContent}>
        <div className={styles.tourTip}>TIP: {tip}</div>
        <div className={styles.tourTitle}>{title}</div>
        <div className={styles.tourDescription}>{description}</div>
        <div className={styles.tourButtons}>
          <button
            onClick={() => setCurrentStep((typeof currentStep === 'number' ? currentStep : 0) - 1)}
            className={styles.tourButton}
            disabled={typeof currentStep === 'number' && currentStep === 0}
          >
            Quay lại
          </button>
          <button
            onClick={() => setCurrentStep((typeof currentStep === 'number' ? currentStep : 0) + 1)}
            className={styles.tourButton + ' ' + styles.tourButtonPrimary}
          >
            {typeof currentStep === 'number' && currentStep === steps.length - 1 ? 'Kết thúc' : 'Tiếp theo'}
          </button>
          <button onClick={handleClose} className={styles.tourButton + ' ' + styles.tourButtonClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

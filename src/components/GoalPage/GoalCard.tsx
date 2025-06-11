import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi'
import { MdBolt, MdStar, MdEmojiEvents } from 'react-icons/md'
import styles from './GoalCard.module.css'
import { useLanguage } from '../../context/LanguageContext'

interface GoalCardProps {
  goal: {
    id: string
    title: string
    subtitle?: string
    icon: JSX.Element
    target: number
    current: number
    remaining: number
    due: string
    status: string
    category?: string
    overdue?: boolean
    created?: string // start date for days to achieve
  }
  onEdit?: () => void
  onDelete?: () => void
}

const formatCurrency = (amount: number, t: (namespace: string, key: string) => string) => {
  return amount.toLocaleString('vi-VN') + t('common', 'currency')
}

export const GoalCard = ({ goal, onEdit, onDelete }: GoalCardProps) => {
  const { t } = useLanguage()
  const percent = Math.round((goal.current / goal.target) * 100)
  const showStar = percent > 80
  const isOverdue = goal.overdue
  const isCompleted = goal.status === 'completed'

  // Circular progress bar values
  const radius = 90
  const stroke = 14
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI

  // Days to achieve
  let daysToAchieve: number | null = null
  if (isCompleted && goal.created) {
    const start = new Date(goal.created)
    const end = new Date(goal.due)
    daysToAchieve = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className={styles.goalCardContainer}>
      <div className={styles.goalCardHeader}>
        <div className={styles.goalIconCircle}>{goal.icon}</div>
        <div className={styles.goalCardTitleBlock}>
          <div className={styles.goalCardTitle}>{goal.title}</div>
          {goal.category && <span className={styles.categoryBadge}>{goal.category}</span>}
        </div>
        <div className={styles.goalCardActions}>
          <span className={styles.statusBadge + ' ' + (isCompleted ? styles.completed : '')}>
            {isCompleted ? (
              'Hoàn thành'
            ) : (
              <>
                <MdBolt style={{ color: '#1976d2' }} /> Đang thực hiện
              </>
            )}
          </span>
          {!isCompleted && (
            <>
              <button className={styles.iconBtn} onClick={onEdit} aria-label='Chỉnh sửa mục tiêu'>
                <FiEdit2 />
              </button>
              <button className={styles.iconBtn} onClick={onDelete} aria-label='Xóa mục tiêu'>
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.goalCardProgressCircle}>
        {isCompleted ? (
          <>
            <svg className={styles.goalCardCelebrationRing} width={190} height={190}>
              <circle cx={95} cy={95} r={80} fill='none' stroke='url(#goldGradient)' strokeWidth={14} />
              <defs>
                <linearGradient id='goldGradient' x1='0' y1='0' x2='1' y2='1'>
                  <stop offset='0%' stopColor='#ffe082' />
                  <stop offset='100%' stopColor='#ffb300' />
                </linearGradient>
              </defs>
            </svg>
            <svg className={styles.goalCardCelebrationRingShimmer} width={190} height={190}>
              <circle cx={95} cy={95} r={80} fill='none' stroke='url(#shimmerGradient)' strokeWidth={14} />
              <defs>
                <linearGradient id='shimmerGradient' x1='0' y1='0' x2='1' y2='1'>
                  <stop offset='0%' stopColor='#fff' stopOpacity='0.0' />
                  <stop offset='50%' stopColor='#fff' stopOpacity='0.7' />
                  <stop offset='100%' stopColor='#fff' stopOpacity='0.0' />
                </linearGradient>
              </defs>
            </svg>
            <svg className={styles.goalCardConfetti} viewBox='0 0 60 32'>
              <circle cx='10' cy='10' r='2' fill='#ffb300' />
              <circle cx='30' cy='6' r='2.5' fill='#e57373' />
              <circle cx='50' cy='12' r='2' fill='#64b5f6' />
              <rect x='20' y='20' width='3' height='7' fill='#81c784' rx='1.5' />
              <rect x='40' y='18' width='3' height='7' fill='#ba68c8' rx='1.5' />
            </svg>
          </>
        ) : (
          <svg width={radius * 2} height={radius * 2}>
            <circle cx={radius} cy={radius} r={normalizedRadius} fill='none' stroke='#e3f0fa' strokeWidth={stroke} />
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill='none'
              stroke='url(#blueGradient)'
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (percent / 100) * circumference}
              strokeLinecap='round'
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,1,.4,1)' }}
            />
            <defs>
              <linearGradient id='blueGradient' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#4fc3f7' />
                <stop offset='100%' stopColor='#1976d2' />
              </linearGradient>
            </defs>
          </svg>
        )}
        <div className={styles.goalCardProgressText}>
          {isCompleted ? (
            <>
              <div className={styles.goalCardCelebrationIcon}>🎉</div>
              <div className={styles.goalCardCelebrationText}>Đã đạt được mục tiêu!</div>
              <div className={styles.goalCardCelebrationValue}>{formatCurrency(goal.target, t)}</div>
              {daysToAchieve && (
                <div className={styles.goalCardDaysToAchieve}>
                  <MdEmojiEvents />
                  Hoàn thành trong {daysToAchieve} {daysToAchieve === 1 ? 'ngày' : 'ngày'}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.goalCardProgressPercentBig}>{percent}%</div>
              <div className={styles.goalCardProgressLabel}>Hoàn thành</div>
            </>
          )}
        </div>
        {!isCompleted && showStar && (
          <span className={styles.goalCardStar + (showStar ? ' ' + styles.visible : '')}>
            <MdStar />
          </span>
        )}
      </div>
      {isCompleted && (
        <div className={styles.goalCardCompletionBadge}>
          <FiCalendar style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Hoàn thành vào{' '}
          {new Date(goal.due).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      )}
      {!isCompleted && (
        <>
          <div className={styles.goalCardStatsTopRow}>
            <div className={styles.goalCardStatTopBox}>
              <div className={styles.goalCardStatTop}>
                <div className={styles.goalCardStatLabel}>HIỆN TẠI</div>
                <div className={styles.goalCardStatValue}>{formatCurrency(goal.current, t)}</div>
              </div>
              <div className={styles.goalCardStatTop}>
                <div className={styles.goalCardStatLabel}>MỤC TIÊU</div>
                <div className={styles.goalCardStatValue}>{formatCurrency(goal.target, t)}</div>
              </div>
            </div>
          </div>
          <div className={styles.goalCardStatRemainingBox}>
            <div className={styles.goalCardStatRemainingLabel}>CÒN LẠI</div>
            <div className={styles.goalCardStatRemainingValue}>{formatCurrency(goal.remaining, t)}</div>
          </div>
        </>
      )}
      {isOverdue && !isCompleted && (
        <div className={styles.goalCardOverdue}>
          <FiCalendar /> Quá hạn
        </div>
      )}
    </div>
  )
}

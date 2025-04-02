import React, { useState } from 'react'
import styles from './Goals.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faPencilAlt, faBullseye } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useModal } from '../../../hooks/useModal'
import EditTarget from './EditTarget/EditTarget'

const Goals = () => {
  const { isModalOpen, openModal, closeModal } = useModal()
  const [targetDetails, setTargetDetails] = useState({
    target: 20000,
    description: '',
    deadline: ''
  })

  return (
    <div className={styles.goals}>
      <div className={styles.header}>
        <h2>Goals</h2>
        <p>May, 2023</p>
      </div>
      <div className={styles.targetSection}>
        <p className={styles.target}>${targetDetails.target.toLocaleString()}</p>
        <button className={styles.editButton} onClick={openModal}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.achievements}>
          <div className={styles.achievement}>
            <div className={styles.achievementHeader}>
              <FontAwesomeIcon icon={faTrophy} className={styles.icon} />
              <p>Target Achieved</p>
            </div>
            <p>${(12500).toLocaleString()}</p>
          </div>
          <div className={styles.achievement}>
            <div className={styles.achievementHeader}>
              <FontAwesomeIcon icon={faBullseye} className={styles.icon} />
              <p>This month Target</p>
            </div>
            <p>${targetDetails.target.toLocaleString()}</p>
          </div>
        </div>
        <div className={styles.goalChart}>
          <div className={styles.chart}>
            <CircularProgressbar
              value={(12500 / targetDetails.target) * 100}
              text={`${Math.floor(12500 / 1000)}K`}
              styles={buildStyles({
                pathColor: '#00b894',
                textColor: '#2c3e50',
                trailColor: '#dfe6e9',
                textSize: '20px'
              })}
            />
          </div>
          <p className={styles.chartLabel}>Target vs Achievement</p>
        </div>
      </div>
      {isModalOpen && (
        <EditTarget targetDetails={targetDetails} setTargetDetails={setTargetDetails} closeModal={closeModal} />
      )}
    </div>
  )
}

export default Goals

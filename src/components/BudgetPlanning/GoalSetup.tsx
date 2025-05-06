import React, { useState } from 'react'
import styles from './GoalSetup.module.css'

const GoalSetup = () => {
  const [goal, setGoal] = useState(1000)
  const [progress, setProgress] = useState(400)

  const percentage = Math.min((progress / goal) * 100, 100)

  return (
    <div className={styles.goalSetup}>
      <h2>Goal Setup</h2>
      <div className={styles.goalProgress}>
        <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
      </div>
      <p>
        Progress: ${progress} / ${goal} ({percentage.toFixed(1)}%)
      </p>
      <button onClick={() => setProgress(progress + 100)}>Add $100</button>
    </div>
  )
}

export default GoalSetup

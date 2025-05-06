import React from 'react'
import styles from './BudgetPlanningPage.module.css'
import PlanComparison from '../../components/BudgetPlanning/PlanComparison'
import GoalSetup from '../../components/BudgetPlanning/GoalSetup'
import BudgetSetup from '../../components/BudgetPlanning/BudgetSetup'

const BudgetPlanningPage = () => {
  return (
    <div className={styles.budgetPlanningPage}>
      <header className={styles.header}>
        <h1>Budget & Planning</h1>
      </header>
      <div className={styles.grid}>
        <BudgetSetup />
        <PlanComparison />
        <GoalSetup />
      </div>
    </div>
  )
}

export default BudgetPlanningPage

export interface Goals {
  id: string
  amount: number
  description: string
  target_date: string
  amortized_days: number
  created_at: string
  [key: string]: string | number
}

export interface AllocateSavingToGoals extends Goals {
  allocated: number
  goal_id: string
}

export interface GoalContributions {
  id: string
  goal_id: string
  month: string
  amount: number
  source?: string
}

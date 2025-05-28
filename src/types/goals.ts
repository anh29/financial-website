export interface Goals {
  id: string
  amount: number
  description: string
  target_date: string
  start_date: string
  repeat_type: string
  status: string
  category: string
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

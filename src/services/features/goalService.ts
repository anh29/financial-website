import { Goals } from '../../types/goals'
import { SERVER_URL } from '../../utils/constants'
import { getUser } from '../../utils/userUtils'

// Move to a separate error handling utility file
class APIError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = 'APIError'
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new APIError(error.message || 'An error occurred', response.status)
  }
  return response.json()
}

// Move to a separate API client file
const goalAPI = {
  create: async (goals: Goals[]): Promise<Goals[]> => {
    const user = getUser()
    if (!user) throw new APIError('User not found')

    const body = goals.map((item) => ({
      ...item,
      userId: user.id
    }))

    const response = await fetch(`${SERVER_URL}/crud/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const { data } = await handleResponse<{ data: Goals[] }>(response)
    return data
  },

  update: async (goal: Goals): Promise<Goals> => {
    const response = await fetch(`${SERVER_URL}/crud/goals/${goal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    })

    return handleResponse<Goals>(response)
  },

  delete: async (goalId: string): Promise<void> => {
    const response = await fetch(`${SERVER_URL}/crud/goals/${goalId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    await handleResponse(response)
  },

  fetchById: async (goalId: string): Promise<Goals> => {
    const response = await fetch(`${SERVER_URL}/crud/goals/${goalId}`)
    return handleResponse<Goals>(response)
  },

  fetchByUserId: async (): Promise<Goals[]> => {
    const user = getUser()
    if (!user) throw new APIError('User not found')

    const response = await fetch(`${SERVER_URL}/crud/goals/user/${user.id}`)
    return handleResponse<Goals[]>(response)
  }
}

export const {
  create: createGoal,
  update: updateGoal,
  delete: deleteGoal,
  fetchById: fetchGoalById,
  fetchByUserId: fetchGoalsByUserId
} = goalAPI

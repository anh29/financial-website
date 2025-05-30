import { AddBillContributionForm, AddBillForm, UpcomingBill, UpcomingBillContribution } from '../../types/upcoming'
import { SERVER_URL } from '../../utils/constants'
import { getUser } from '../../utils/userUtils'

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

const upcomingAPI = {
  create: async (bills: AddBillForm[]): Promise<UpcomingBill[]> => {
    const user = getUser()
    if (!user) throw new APIError('User not found')

    const body = bills.map((item) => ({
      ...item,
      status: 'active',
      userId: user.id
    }))

    const response = await fetch(`${SERVER_URL}/crud/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const { data } = await handleResponse<{ data: UpcomingBill[] }>(response)
    return data
  },

  update: async (bill: UpcomingBill): Promise<UpcomingBill> => {
    const response = await fetch(`${SERVER_URL}/crud/bills/${bill.bill_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill)
    })

    return handleResponse<UpcomingBill>(response)
  },

  delete: async (billId: string): Promise<void> => {
    const response = await fetch(`${SERVER_URL}/crud/bills/${billId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    await handleResponse(response)
  },

  fetchById: async (billId: string): Promise<UpcomingBill> => {
    const response = await fetch(`${SERVER_URL}/crud/bills/${billId}`)
    return handleResponse<UpcomingBill>(response)
  },

  fetchByUserId: async (): Promise<{ data: UpcomingBill[]; message: string }> => {
    const user = getUser()
    if (!user) throw new APIError('User not found')

    const response = await fetch(`${SERVER_URL}/crud/bills/user/${user.id}`)
    return handleResponse<{ data: UpcomingBill[]; message: string }>(response)
  }
}

export const addUpcomingBillContribution = async (
  billContributions: AddBillContributionForm
): Promise<{ message: string; data: UpcomingBillContribution[] }> => {
  const user = getUser()
  if (!user) throw new APIError('User not found')

  const response = await fetch(`${SERVER_URL}/crud/billsPayments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...billContributions, userId: user.id })
  })

  return handleResponse<{ message: string; data: UpcomingBillContribution[] }>(response)
}

export const {
  create: createUpcomingBill,
  update: updateUpcomingBill,
  delete: deleteUpcomingBill,
  fetchById: fetchUpcomingBillById,
  fetchByUserId: fetchUpcomingBillsByUserId
} = upcomingAPI

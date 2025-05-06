import { SERVER_URL } from './constants'

export const classifyTransaction = async ({ description }: { description?: string }): Promise<string> => {
  const response = await fetch(`${SERVER_URL}/smart/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  })

  if (!response.ok) throw new Error('Failed to classify category')

  const data = await response.json()
  return data.predictedCategory.key
}

export interface ClassificationState {
  isClassifying: boolean
  classificationError?: string
}

export const predictCategoryWithState = async (
  description: string,
  onSuccess: (category: string) => void,
  onStateChange: (state: ClassificationState) => void
) => {
  if (!description || description.length < 3) return

  onStateChange({ isClassifying: true, classificationError: '' })

  try {
    const predictedCategory = await classifyTransaction({ description })
    onSuccess(predictedCategory)
    onStateChange({ isClassifying: false })
  } catch (err) {
    onStateChange({ isClassifying: false, classificationError: '⚠ Classification failed' })
  }
}

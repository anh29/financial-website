// Utility function to find by ID
export const findById = <T extends { id: string | number }>(array: T[], id: string | number): T | undefined => {
  return array.find((item) => item.id === id)
}

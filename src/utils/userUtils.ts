// Function to generate an avatar abbreviation from the username
export const generateAvatar = (username: string): string => {
  if (!username) return ''
  const words = username.split(' ')
  if (words.length === 1) {
    return words[0][0].toUpperCase() // Single word: take the first letter
  }
  // Multiple words: take the first letter of each word except the last
  const abbreviation = words
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join('')

  return abbreviation
}

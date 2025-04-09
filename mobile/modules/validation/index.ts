export const isEmpty = (value: string) => {
  return !value || value.trim() === ''
}

export const isInvalidURL = (url: string) => {
  try {
    new URL(url)
    return false
  } catch {
    return true
  }
}

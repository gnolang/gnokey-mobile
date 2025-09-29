export const sliceString = (str: string, initialChars = 6, finalChars = 4) => {
  if (str.length <= initialChars + finalChars) {
    return str
  }
  const initial = str.slice(0, 8)
  const final = str.slice(-8)
  return `${initial}...${final}`
}

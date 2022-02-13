export const isNumber = (str: string) => {
  if (isNaN(+str)) {
    return false
  } else if (!str.trim()) {
    // checks for string with spaces only
    return false
  }
  return true
}

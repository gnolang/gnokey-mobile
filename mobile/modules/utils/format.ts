import { getLocales } from 'expo-localization'

const locale = getLocales()[0]?.languageTag || 'en-US'

const balance = (value?: bigint) => {
  // Figure out the grouping separator for this locale
  const sample = new Intl.NumberFormat(locale).format(1000)
  const groupSeparator = sample.replace(/\p{Number}/gu, '')[0] || ','

  return value === undefined ? '' : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)
}

// Convert SQLite date (YYYY-MM-DD HH:mm:ss) to local date string
const date = (sqliteDate: string) => {
  const dateObj = sqliteDate
    ? new Date(sqliteDate.replace(' ', 'T') + 'Z') // Treat as UTC
    : new Date()
  return dateObj.toLocaleString(locale)
}

export const formatter = { balance, date }

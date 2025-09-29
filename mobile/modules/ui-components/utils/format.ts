import { getLocales } from 'expo-localization'
import BigNumber from 'bignumber.js'
import { GNOT_TOKEN } from '@/redux/features/constants'

const locale = getLocales()[0]?.languageTag || 'en-US'

/**
 * Converts ugnot to gnot and formats with locale-aware thousands separators
 * If 0, return "0"
 * If no decimal part, return integer only
 * If decimal part, return up to 6 decimal places, trimming trailing zeros
 * @param value bignit in ugnot, where 1000000ugnot = 1 gnot
 * @returns gnot converted to string with locale-aware thousands separators
 */
const balance = (value?: bigint) => {
  if (value === undefined) {
    return '0'
  }

  if (BigNumber(value).isInteger()) {
    return BigNumber(value)
      .shiftedBy(GNOT_TOKEN.decimals * -1)
      .toNumber()
  }

  return BigNumber(value)
    .shiftedBy(GNOT_TOKEN.decimals * -1)
    .toFormat(6)
    .replace(/\.?0+$/, '')
}

// Convert SQLite date (YYYY-MM-DD HH:mm:ss) to local date string
const date = (sqliteDate: string) => {
  const dateObj = sqliteDate
    ? new Date(sqliteDate.replace(' ', 'T') + 'Z') // Treat as UTC
    : new Date()
  return dateObj.toLocaleString(locale)
}

export const formatter = { balance, date }

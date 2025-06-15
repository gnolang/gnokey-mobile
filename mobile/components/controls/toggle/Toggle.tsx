import React from 'react'
import { ToggleProps } from './interfaces'
import { TogglePriv } from './Toggle.priv'
import { useTheme } from 'styled-components/native'

export const Toggle: React.FC<ToggleProps> = (props) => {
  const theme = useTheme()
  return (
    <TogglePriv
      {...props}
      styleColors={{
        circleBackground: theme.colors.white,
        toggleBackgroundInactive: theme.colors.background,
        toggleBackgroundActive: theme.colors.primary
      }}
    />
  )
}

import React from 'react'
import { colors } from '@/assets'
import { ToggleProps } from './interfaces'
import { TogglePriv } from './Toggle.priv'

export const Toggle: React.FC<ToggleProps> = (props) => {
  return (
    <TogglePriv
      {...props}
      styleColors={{
        circleBackground: 'white',
        toggleBackgroundInactive: '#EDF0F3',
        toggleBackgroundActive: colors.primary
      }}
    />
  )
}

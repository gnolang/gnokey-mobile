import React from 'react'
import { Text, TextProps } from 'react-native'
import { useTheme } from 'styled-components/native'

export const UnifiedText: React.FC<TextProps> = (props) => {
  const { children, style } = props
  const theme = useTheme()
  return (
    <Text {...props} style={[{ fontSize: 14, fontFamily: 'Open Sans', color: theme.colors.black }, style]}>
      {children}
    </Text>
  )
}

import React from 'react'
import { StyleProp, TextStyle, View } from 'react-native'
import styled from 'styled-components/native'
import * as Clipboard from 'expo-clipboard'
import { ListRow } from '../../atoms/layout/ListRow'
import { Text } from '../../text'

type Props = {
  label: string
  value?: string | number | React.ReactNode
  copyTextValue?: string
  labelStyle?: StyleProp<TextStyle> | undefined
  linkStyle?: boolean
  endAdornment?: React.ReactNode
} & React.ComponentProps<typeof ListRow>

export const FormItem: React.FC<Props> = ({
  children,
  label,
  value,
  copyTextValue,
  endAdornment,
  linkStyle,
  labelStyle = { fontWeight: 500, minWidth: 100 },
  ...props
}) => {
  const copyToClipboard = async () => {
    if (!copyTextValue) return
    await Clipboard.setStringAsync(copyTextValue)
  }

  return (
    <>
      <ListRow {...props} onPress={copyToClipboard}>
        {/* Label */}
        <Text.Body style={labelStyle}>{label}</Text.Body>
        {/* Value */}
        {value !== undefined && <ValueContent linkStyle={linkStyle}>{value}</ValueContent>}
        {endAdornment && <View style={{ marginLeft: 8 }}>{endAdornment}</View>}
      </ListRow>
      {children && <View style={{ marginBottom: 12 }}>{children}</View>}
    </>
  )
}

const ValueContent = ({
  children,
  linkStyle,
  valueStyle
}: {
  children: React.ReactNode
  linkStyle?: boolean
  valueStyle?: StyleProp<TextStyle>
}) => {
  if (linkStyle) {
    return <Text.LinkText style={[{ flexShrink: 1, textAlign: 'right' }, valueStyle]}>{children}</Text.LinkText>
  }
  return <Text.Body style={[{ flexShrink: 1, width: '100%' }, valueStyle]}>{children}</Text.Body>
}

export const FormTextValue = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  letter-spacing: 0.5px;
  font-weight: 500;
`

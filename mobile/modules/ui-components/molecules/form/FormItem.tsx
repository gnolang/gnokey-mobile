import React from 'react'
import { StyleProp, TextStyle, View } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../src'
import { ListRow } from '../../atoms/list/ListRow'

type Props = {
  label: string
  value?: string | number | React.ReactNode
  labelStyle?: StyleProp<TextStyle> | undefined
  linkStyle?: boolean
} & React.ComponentProps<typeof ListRow>

export const FormItem: React.FC<Props> = ({
  children,
  label,
  value,
  linkStyle,
  labelStyle = { fontWeight: 500, minWidth: 140 },
  ...props
}) => {
  return (
    <>
      <ListRow {...props}>
        <Text.Body style={labelStyle}>{label}</Text.Body>
        {value !== undefined && <ValueContent linkStyle={linkStyle}>{value}</ValueContent>}
      </ListRow>
      {children && <View style={{ marginBottom: 12 }}>{children}</View>}
    </>
  )
}

const ValueContent = ({ children, linkStyle }: { children: React.ReactNode; linkStyle?: boolean }) => {
  if (linkStyle) {
    return (
      <Text.LinkText weight="500" style={{ flexShrink: 1, textAlign: 'right' }}>
        {children}
      </Text.LinkText>
    )
  }
  return <Text.Body_Bold style={{ flexShrink: 1 }}>{children}</Text.Body_Bold>
}

export const FormItemInline = styled(FormItem)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const FormTextValue = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  letter-spacing: 0.5px;
  font-weight: 500;
`

import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../src'
import { ListRow } from '../../atoms/list/ListRow'

type Props = {
  label: string
  value?: string | number
  labelStyle?: StyleProp<TextStyle> | undefined
} & React.ComponentProps<typeof ListRow>

export const FormItem: React.FC<Props> = ({
  children,
  label,
  value,
  labelStyle = { fontWeight: 500, minWidth: 140 },
  ...props
}) => {
  return (
    <ListRow {...props}>
      <Text.Body style={labelStyle}>{label}</Text.Body>
      {children}
      {value !== undefined && <Text.Body_Bold style={{ flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>{value}</Text.Body_Bold>}
    </ListRow>
  )
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

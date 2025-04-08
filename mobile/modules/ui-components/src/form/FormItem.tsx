import styled from 'styled-components/native'
import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import * as Text from '../text'

type Props = {
  label: string
  labelStyle?: StyleProp<TextStyle> | undefined
} & React.ComponentProps<typeof Container>

export const FormItem: React.FC<Props> = ({ children, label, labelStyle = { fontWeight: 500 }, ...props }) => {
  return (
    <Container {...props}>
      <TextLabel style={labelStyle}>{label}</TextLabel>
      {children}
    </Container>
  )
}

export const FormItemInline = styled(FormItem)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TextLabel = styled(Text.Body)`
  padding-bottom: 4px;
`

const Container = styled.View`
  align-items: flex-start;
  border-radius: ${({ theme }) => theme.borderRadius - 12}px;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.textinputs.primary.background};
`

export const FormTextValue = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  letter-spacing: 0.5px;
  font-weight: 500;
`

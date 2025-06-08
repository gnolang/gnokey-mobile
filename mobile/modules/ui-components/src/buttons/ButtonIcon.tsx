import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import { ButtonColor } from '.'

export interface ButtonIconProp extends TouchableOpacityProps {
  children: React.ReactNode
  color?: ButtonColor
  size?: number
}

export const ButtonIcon: React.FC<ButtonIconProp> = (props) => {
  return (
    <ButtonWrapper {...props} $color={props.color} style={[props.style]}>
      {props.children}
    </ButtonWrapper>
  )
}
const ButtonWrapper = styled(TouchableOpacity)<{ $color?: ButtonColor; size?: number }>`
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  border-radius: ${({ size }) => (size ? size / 2 : 20)}px;
  flex-direction: row;
  font-size: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.$color ? props.theme.buttons[props.$color] : 'transparent')};
`

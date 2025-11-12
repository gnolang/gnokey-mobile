import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import { ButtonColor } from '../../buttons'
import { Text } from '../..'

export interface ButtonProp extends TouchableOpacityProps {
  children: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  color?: ButtonColor
  loading?: boolean
}

const Button: React.FC<ButtonProp> = (props) => {
  const isChildrenString = typeof props?.children === 'string'
  const { color } = props

  return (
    <ButtonWrapper $color={color}>
      {props.startIcon ? <StartIconWrapper>{props.startIcon}</StartIconWrapper> : null}
      {isChildrenString ? <Text.ButtonLabel $color={props.color}>{props.children}</Text.ButtonLabel> : props.children}
      {props.endIcon ? <EndIconWrapper>{props.endIcon}</EndIconWrapper> : null}
    </ButtonWrapper>
  )
}

const StartIconWrapper = styled.View`
  margin-right: 8px;
`
const EndIconWrapper = styled.View`
  margin-left: 8px;
`

interface ButtonWrapperProps extends TouchableOpacityProps {
  $color?: ButtonColor
}

const ButtonWrapper = styled(TouchableOpacity)<ButtonWrapperProps>`
  height: 48px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-horizontal: 16px;
  border-radius: ${(props) => props.theme.borderRadius || 20}px;
  border: 1px solid ${(props) => (props.$color ? props.theme.buttons[props.$color].border : props.theme.buttons.primary.border)};
  background-color: ${(props) =>
    props.$color ? props.theme.buttons[props.$color].background : props.theme.buttons.primary.background};
`
export default Button

import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import * as Text from '../text'
import { ButtonColor } from './index'

export interface ButtonProp extends TouchableOpacityProps {
  children: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  color?: ButtonColor
  loading?: boolean
}

export const Button: React.FC<ButtonProp> = (props) => {
  const isChildrenString = typeof props.children === 'string'

  return (
    <ButtonWrapper {...props} $color={props.color} style={[props.style]} disabled={props.loading || props.disabled}>
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
  background-color: ${(props) => (props.$color ? props.theme.buttons[props.$color] : props.theme.buttons.primary)};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
`

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
    <ButtonWrapper {...props} $color={props.color} style={[props.style]} disabled={props.loading}>
      {props.startIcon ? <StartIconWrapper>{props.startIcon}</StartIconWrapper> : null}
      {isChildrenString ? <Text.ButtonLabel $color={props.color}>{props.children}</Text.ButtonLabel> : props.children}
      {props.endIcon ? <EndIconWrapper>{props.endIcon}</EndIconWrapper> : null}
    </ButtonWrapper>
  )
}

export const ButtonProfile: React.FC<Button> = (props) => {
  const isChildrenString = typeof props.children === 'string'

  return (
    <ButtonProfileWrapper {...props} $color={props.color} style={[props.style]} disabled={props.loading}>
      {props.startIcon ? <StartIconWrapper>{props.startIcon}</StartIconWrapper> : null}
      {isChildrenString ? <ButtonProfileLabel $color={props.color}>{props.children}</ButtonProfileLabel> : props.children}
      {props.endIcon ? <EndIconWrapper>{props.endIcon}</EndIconWrapper> : null}
    </ButtonProfileWrapper>
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
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-horizontal: 16px;
  border-radius: ${(props) => props.theme.borderRadius || 20}px;
  background-color: ${(props) => (props.$color ? props.theme.buttons[props.$color] : props.theme.buttons.primary)};
`

const ButtonProfileWrapper = styled(TouchableOpacity)<ButtonWrapperProps>`
  height: 60px;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding-horizontal: 24px;
  border-radius: ${(props) => props.theme.borderRadius * 2 || 20}px;
  color: ${(props) => props.theme.colors.black};
  background-color: ${(props) => (props.$color ? props.theme.buttons[props.$color] : props.theme.buttons.tertirary)};
`
export const ButtonProfileLabel = styled.Text<{ $color?: ButtonColor }>`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.32px;
  width: 95%;
  color: ${(props) => (props.$color ? props.$color : props.theme.colors.black)};
`

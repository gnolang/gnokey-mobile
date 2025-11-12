import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import styled from 'styled-components/native'
// import * as Text from '../text'
import { ButtonColor } from './types'
import { ReactNode, FC } from 'react'

export interface ButtonProp {
  children?: ReactNode
  // startIcon?: ReactNode
  // endIcon?: ReactNode
  color?: string
  // style?: any
  // loading?: boolean
  // disabled?: boolean
  // Anything else you want the wrapper to receive:
  onPress?: () => void
}

// const Button: React.FC<ButtonProp> = () => {
//   return <ButtonWrapper />
// }
interface Props {
  space?: 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64
}
const Button: React.FC<Props> = ({ space = 8 }) => {
  return React.createElement(View, { style: { height: space } })
}

// const Button: FC<ButtonProp> = ({ children, startIcon, endIcon, color, style, loading, disabled, ...rest }) => {
const Button2: FC<ButtonProp> = ({ children, color, ...rest }) => {
  return (
    // <ButtonWrapper {...rest} $color="primary" style={style} disabled={loading || disabled}>
    <ButtonWrapper {...rest} $color="primary">
      {/* {startIcon && <StartIconWrapper>{startIcon}</StartIconWrapper>} */}
      <ButtonLabel $color="primary">{children}</ButtonLabel>
      {/* {endIcon && <EndIconWrapper>{endIcon}</EndIconWrapper>} */}
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
  border-radius: ${(props) => props.theme?.borderRadius || 20}px;
  background-color: ${(props) => {
    const c = props.theme.buttons[props.$color || 'primary'] as unknown as { background: string; border: string }
    return c?.background || '#007AFF'
  }};
  border-width: 1px;
  border-color: ${(props) => {
    const c = props.theme.buttons[props.$color || 'primary'] as unknown as { background: string; border: string }
    return c?.border || '#007AFF'
  }};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
`

interface ButtonLabelProps {
  $color?: ButtonColor
}

const ButtonLabel = styled(Text)<ButtonLabelProps>`
  color: ${(props) => {
    const c = props.theme.buttons[props.$color || 'primary'] as unknown as { label: string }
    return c?.label || '#FFFFFF'
  }};
  font-weight: 600;
  font-size: 16px;
`

export default Button

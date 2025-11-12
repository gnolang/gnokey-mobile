import React from 'react'
import styled from 'styled-components/native'
import { TextInput, TextInputProps } from 'react-native'

interface ForwardedInputProps extends TextInputProps {
  ref?: React.Ref<TextInput>
  icon?: React.ReactNode
  leftIcon?: React.ReactNode
  onIconPress?: () => void
}

const InputContainer = styled.View<{ editable?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, editable }) =>
    editable === false ? theme.textinputs.disabled.background : theme.textinputs.background};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  height: 46px;
`

const StyledTextInput = styled.TextInput<ForwardedInputProps>`
  flex: 1;
  font-size: 17px;
  padding: 8px 12px;
  background-color: transparent;
  cursor: ${(props) => (props.editable ? 'text' : 'not-allowed')};
`

const IconContainerRight = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding-right: 8px;
`
const IconContainerLeft = styled.View`
  justify-content: center;
  align-items: center;
  padding-left: 8px;
`

const TextInputStyled = React.forwardRef<TextInput, ForwardedInputProps>(({ icon, leftIcon, onIconPress, ...props }, ref) => {
  return (
    <InputContainer editable={props.editable}>
      {leftIcon ? <IconContainerLeft>{leftIcon}</IconContainerLeft> : null}
      <StyledTextInput {...props} ref={ref} />
      {icon ? (
        <IconContainerRight onPress={onIconPress} disabled={!onIconPress}>
          {icon}
        </IconContainerRight>
      ) : null}
    </InputContainer>
  )
})

TextInputStyled.displayName = 'TextInput'

export default TextInputStyled

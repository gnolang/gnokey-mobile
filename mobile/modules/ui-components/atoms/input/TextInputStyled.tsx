import React from 'react'
import styled from 'styled-components/native'
import { TextInput, TextInputProps } from 'react-native'

interface ForwardedInputProps extends TextInputProps {
  ref?: React.Ref<TextInput>
  // Add any custom props specific if needed
}

// TO Kill
const StyledTextInputX = styled.TextInput<ForwardedInputProps>`
  flex: 1;
  font-size: 17px;
  height: 46px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  transition: background-color 0.2s ease;
  background-color: ${({ theme, editable }) =>
    editable === false ? theme.textinputs.disabled.background : theme.textinputs.background};
  cursor: ${(props) => (props.editable ? 'text' : 'not-allowed')};
`

const TextInputStyledX = React.forwardRef<TextInput, ForwardedInputProps>((props, ref) => <StyledTextInputX {...props} ref={ref} />)

TextInputStyledX.displayName = 'TextInput'

export default TextInputStyledX

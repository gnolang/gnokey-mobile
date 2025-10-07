import React from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import TextInputStyled from './TextInputStyled'

interface ForwardedInputProps extends TextInputProps {
  ref?: React.Ref<RNTextInput>
  error?: string
  // Add any custom props specific if needed
}

const TextFieldBasic = React.forwardRef<RNTextInput, ForwardedInputProps>((props, ref) => {
  return (
    <>
      <TextInputStyled ref={ref} {...props} />
    </>
  )
})

TextFieldBasic.displayName = 'TextFieldBasic'

export default TextFieldBasic

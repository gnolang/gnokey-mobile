import React from 'react'
import { TextInput as RNTextInput, TextInputProps, View } from 'react-native'
import TextInputStyled from './TextInputStyled'
import { TextInputLabel } from './TextInputLabel'
import { TextInputDescription } from './TextInputDescription'

interface ForwardedInputProps extends TextInputProps {
  ref?: React.Ref<RNTextInput>
  label?: string
  description?: string
  error?: string
  leftIcon?: React.ReactNode
  // Add any custom props specific if needed
}

const TextFieldForm = React.forwardRef<RNTextInput, ForwardedInputProps>((props, ref) => {
  const { label, description, error, ...rest } = props
  return (
    <View style={{ width: '100%' }}>
      {label && <TextInputLabel>{label}</TextInputLabel>}
      {description && <TextInputDescription>{description}</TextInputDescription>}
      <TextInputStyled ref={ref} {...rest} />
    </View>
  )
})

TextFieldForm.displayName = 'TextFieldForm'

export default TextFieldForm

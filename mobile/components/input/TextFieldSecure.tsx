import React from 'react'
import { TextInput as RNTextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import TextInputStyled from './TextInputStyled'

interface ForwardedInputProps extends TextInputProps {
  ref?: React.Ref<RNTextInput>
  onSecurePress: () => void
  // Add any custom props specific if needed
}

const EyeIcon = ({ isSecureText, onPress }: { isSecureText?: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.eyeIcon}>
    <FontAwesome name={isSecureText ? 'eye-slash' : 'eye'} size={20} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  eyeIcon: { height: '100%', width: 46, alignItems: 'center', justifyContent: 'center' }
})

const TextFieldSecure = React.forwardRef<RNTextInput, ForwardedInputProps>((props, ref) => {
  const { onSecurePress } = props

  return <TextInputStyled ref={ref} {...props} icon={<EyeIcon isSecureText={props.secureTextEntry} onPress={onSecurePress} />} />
})

TextFieldSecure.displayName = 'TextFieldSecure'

export default TextFieldSecure

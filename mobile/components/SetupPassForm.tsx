import { View } from 'react-native'
import { useState } from 'react'
import { TextFieldSecure, TextInputDescription, TextInputLabel } from './input'
import { Spacer } from '@berty/gnonative-ui'
import { CheckPassRequirements } from './list'
interface Props {
  onPasswordDefined: (password?: string) => void
}

export const SetupPassForm = ({ onPasswordDefined }: Props) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSecureText, setShowSecureText] = useState(true)

  return (
    <View>
      <TextInputLabel>Setup your master password</TextInputLabel>
      <TextInputDescription>
        This password will allow you to enter GKM to create, update and sign with your gno accounts
      </TextInputDescription>
      <TextFieldSecure
        placeholder="Enter your master password"
        onSecurePress={() => setShowSecureText((prev) => !prev)}
        secureTextEntry={showSecureText}
        textContentType="newPassword"
        autoComplete="new-password"
        autoCapitalize="none"
        passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
        value={password}
        onChangeText={setPassword}
      />
      <Spacer space={16} />
      <TextFieldSecure
        placeholder="Confirm your master password"
        onSecurePress={() => setShowSecureText((prev) => !prev)}
        secureTextEntry={showSecureText}
        textContentType="newPassword"
        autoComplete="new-password"
        autoCapitalize="none"
        passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Spacer space={32} />
      <CheckPassRequirements password={password} confirmPassword={confirmPassword} onChange={onPasswordDefined} />
    </View>
  )
}

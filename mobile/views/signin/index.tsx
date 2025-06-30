import { Button, Spacer, Text, TextField } from '@/modules/ui-components'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

export interface Props {
  onUnlokPress: (password: string) => void
  onForgotPasswordPress?: () => void
  error?: string
}

const SignInView: React.FC<Props> = ({ onUnlokPress, error, onForgotPasswordPress }) => {
  const [password, setPassword] = useState('')

  return (
    <>
      <TextField
        placeholder="Enter master password"
        label="Master password"
        autoCorrect={false}
        autoCapitalize="none"
        type="password"
        error={error}
        onChangeText={setPassword}
      />
      <Button style={{ width: '100%' }} onPress={() => onUnlokPress(password)} color="primary">
        Unlock
      </Button>
      <Spacer space={32} />
      <TouchableOpacity onPress={onForgotPasswordPress}>
        <Text.Caption>Forgot password?</Text.Caption>
      </TouchableOpacity>
    </>
  )
}

export default SignInView

import { Alert, Button, Spacer, TextFieldBasic } from '@/modules/ui-components'
import { useState } from 'react'

export interface Props {
  onCreateMasterPress: (password: string) => void
  error?: string
}

const SignUpView: React.FC<Props> = ({ onCreateMasterPress, error }) => {
  const [innerError, setInnerError] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onCreate = () => {
    if (!password || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      setInnerError('Passwords do not match.')
      return
    }

    onCreateMasterPress(password)
  }

  return (
    <>
      <TextFieldBasic placeholder="Master password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      <TextFieldBasic
        placeholder="Confirm Master password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        error={error || innerError}
      />
      <Alert severity="error" message={error || innerError} />
      <Spacer space={8} />
      <Button onPress={onCreate} style={{ width: '100%' }}>
        Create Master Password
      </Button>
    </>
  )
}

export default SignUpView

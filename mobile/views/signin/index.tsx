import { Button, Spacer, Text, TextField } from '@/modules/ui-components'
import { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { MATER_PASS_KEY } from '@/redux/features/constants'
import { selectBiometricEnabled, useAppSelector } from '@/redux'

export interface Props {
  onUnlokPress: (password: string) => void
  onForgotPasswordPress?: () => void
  error?: string
}

const SignInView: React.FC<Props> = ({ onUnlokPress, error, onForgotPasswordPress }) => {
  const [password, setPassword] = useState('')
  const isBiometricEnabled = useAppSelector(selectBiometricEnabled)

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        'Biometric Authentication Not Available',
        'Please ensure your device has biometric hardware and you have enrolled at least one biometric credential.'
      )
      return
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock with Face ID',
      fallbackLabel: 'Use Passcode'
    })

    if (result.success) {
      const p = await SecureStore.getItemAsync(MATER_PASS_KEY)
      console.log('Biometric authentication successful, retrieved password:', p)
      setPassword(p!)
      onUnlokPress(p!)
    } else {
      console.log('Biometric authentication failed')
    }
  }

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
      {isBiometricEnabled && (
        <>
          <Button onPress={handleBiometricAuth}>Unlock with FaceID</Button>
          <Spacer />
        </>
      )}
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

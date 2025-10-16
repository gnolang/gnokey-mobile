import { useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { selectBiometricEnabled, useAppSelector } from '@/redux'
import { Button, ButtonText, Spacer, Text } from '../src'
import { TextFieldSecure } from './input'
import { TextInputLabel } from '../atoms'

export interface Props {
  onUnlockPress: (password: string, isBiometric: boolean) => void
  error?: string
}

export const WelcomeBackFooter = ({ onUnlockPress: onUnlokPress, error }: Props) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isBiometric = useAppSelector(selectBiometricEnabled)
  const router = useRouter()

  return (
    <View style={{ width: '100%' }}>
      {!isBiometric ? (
        <>
          <TextInputLabel>Enter your password</TextInputLabel>
          <TextFieldSecure
            onSecurePress={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
            placeholder="Enter password"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setPassword}
          />
        </>
      ) : null}
      <Spacer space={16} />
      <Button color="primary" onPress={() => onUnlokPress(password, isBiometric)}>
        Unlock
      </Button>
      <Spacer space={16} />
      <ButtonText onPress={() => router.push('/onboarding/forgot-pass')}>
        <Text.Caption>Forgot password?</Text.Caption>
      </ButtonText>
    </View>
  )
}

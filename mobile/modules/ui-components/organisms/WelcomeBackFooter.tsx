import { useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { selectBiometricEnabled, useAppSelector } from '@/redux'
import { Button, ButtonText, Spacer, Text, TextField } from '../src'

export interface Props {
  onUnlockPress: (password: string, isBiometric: boolean) => void
  error?: string
}

export const WelcomeBackFooter = ({ onUnlockPress: onUnlokPress, error }: Props) => {
  const [password, setPassword] = useState('')
  const isBiometric = useAppSelector(selectBiometricEnabled)
  const router = useRouter()

  return (
    <View style={{ width: '100%' }}>
      {!isBiometric ? (
        <TextField
          placeholder="Enter password"
          label="Enter your password"
          autoCorrect={false}
          autoCapitalize="none"
          type="password"
          hideError
          onChangeText={setPassword}
        />
      ) : null}
      <Spacer space={16} />
      <Button color="primary" onPress={() => onUnlokPress(password, isBiometric)}>
        Unlock GKM
      </Button>
      <Spacer space={16} />
      <ButtonText onPress={() => router.push('/onboarding/forgot-pass')}>
        <Text.Caption>Forgot password?</Text.Caption>
      </ButtonText>
    </View>
  )
}

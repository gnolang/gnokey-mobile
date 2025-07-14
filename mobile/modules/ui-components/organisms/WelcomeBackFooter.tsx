import { useState } from 'react'
import { Button, ButtonText, Spacer, Text, TextField } from '../src'
import { selectBiometricEnabled, useAppSelector } from '@/redux'

export interface Props {
  onUnlockPress: (password: string, isBiometric: boolean) => void
  onForgotPasswordPress?: () => void
  error?: string
}

export const WelcomeBackFooter = ({ onUnlockPress: onUnlokPress, error, onForgotPasswordPress }: Props) => {
  const [password, setPassword] = useState('')
  const isBiometric = useAppSelector(selectBiometricEnabled)

  return (
    <>
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
      <Spacer space={4} />
      <ButtonText onPress={onForgotPasswordPress}>
        <Text.Caption>Forgot password?</Text.Caption>
      </ButtonText>
    </>
  )
}

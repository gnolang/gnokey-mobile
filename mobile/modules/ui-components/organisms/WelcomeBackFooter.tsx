import { useState } from 'react'
import { Button, ButtonText, Spacer, Text, TextField } from '../src'
import { selectBiometricEnabled, useAppSelector } from '@/redux'
import { useRouter } from 'expo-router'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

export interface Props {
  onUnlockPress: (password: string, isBiometric: boolean) => void
  error?: string
}

export const WelcomeBackFooter = ({ onUnlockPress: onUnlokPress, error }: Props) => {
  const [password, setPassword] = useState('')
  const isBiometric = useAppSelector(selectBiometricEnabled)
  const router = useRouter()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{ width: '100%', paddingBottom: 100, position: 'absolute', bottom: 0 }}
    >
      <Container>
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
      </Container>
    </KeyboardAvoidingView>
  )
}

const Container = styled.View`
  min-height: 180px;
  padding-top: 8px;
  background-color: ${({ theme }) => theme.colors.background};
`

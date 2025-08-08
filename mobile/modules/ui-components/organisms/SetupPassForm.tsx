import styled from 'styled-components/native'
import { Spacer, TextField } from '../src'
import { View } from 'react-native'
import { useEffect, useState } from 'react'
import { CheckItem } from '../molecules/CheckItem'

interface Props {
  onPasswordsCompleted?: (password: string) => void
}

export const SetupPassForm = ({ onPasswordsCompleted }: Props) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  return (
    <View>
      <TextField
        label="Setup your master password"
        description="This password will allow you to enter GKM to create, update and sign with your gno accounts"
        placeholder="Enter your master password"
        secureTextEntry={true}
        type="password"
        textContentType="newPassword"
        autoComplete="new-password"
        passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
        value={password}
        onChangeText={setPassword}
      />
      <Spacer space={16} />
      <TextField
        placeholder="Confirm your master password"
        secureTextEntry={true}
        textContentType="newPassword"
        autoComplete="new-password"
        passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
        type="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Spacer space={32} />
      <PasswordCheckers password={password} confirmPassword={confirmPassword} onPasswordsCompleted={onPasswordsCompleted} />
    </View>
  )
}

interface PasswordCheckersProps {
  password: string
  confirmPassword: string
  onPasswordsCompleted?: (password: string) => void
}

const PasswordCheckers = ({ password, confirmPassword, onPasswordsCompleted }: PasswordCheckersProps) => {
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [min8Chars, setMin8Chars] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasSymbol, setHasSymbol] = useState(false)
  const [hasDigit, setHasDigit] = useState(false)

  useEffect(() => {
    setPasswordsMatch(password.length > 0 && password === confirmPassword)
    setMin8Chars(password.length >= 8)
    setHasUpperCase(/[A-Z]/.test(password))
    setHasSymbol(/[!@#$%^&*]/.test(password))
    setHasDigit(/[0-9]/.test(password))
  }, [password, confirmPassword])

  useEffect(() => {
    if (passwordsMatch && min8Chars && hasUpperCase && hasSymbol && hasDigit) {
      onPasswordsCompleted?.(password)
    }
  }, [passwordsMatch, min8Chars, hasUpperCase, hasSymbol, hasDigit, onPasswordsCompleted, password])

  return (
    <LeftChild>
      <CheckItem isValid={min8Chars}>Minimum 8 characters</CheckItem>
      <CheckItem isValid={hasUpperCase}>At least one upper case</CheckItem>
      <CheckItem isValid={hasSymbol}>At least one symbol</CheckItem>
      <CheckItem isValid={hasDigit}>At least one digit</CheckItem>
      <CheckItem isValid={passwordsMatch}>Both passwords must match</CheckItem>
    </LeftChild>
  )
}

const LeftChild = styled.View`
  align-self: flex-start;
`

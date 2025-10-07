import { useEffect, useMemo } from 'react'
import styled from 'styled-components/native'
import { CheckItem } from '../../molecules/CheckItem'

interface Props {
  password: string
  confirmPassword: string
  onChange: (password?: string) => void
}

const CheckPassRequirements = ({ password, confirmPassword, onChange }: Props) => {
  const requirements = useMemo(
    () => ({
      min8Chars: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasSymbol: /[!@#$%^&*]/.test(password),
      hasDigit: /[0-9]/.test(password),
      passwordsMatch: password.length > 0 && password === confirmPassword
    }),
    [password, confirmPassword]
  )

  const allValid = Object.values(requirements).every(Boolean)

  useEffect(() => {
    onChange(allValid ? password : undefined)
  }, [allValid, password, onChange])

  return (
    <LeftChild>
      <CheckItem isValid={requirements.min8Chars}>Minimum 8 characters</CheckItem>
      <CheckItem isValid={requirements.hasUpperCase}>At least one upper case</CheckItem>
      <CheckItem isValid={requirements.hasSymbol}>At least one symbol</CheckItem>
      <CheckItem isValid={requirements.hasDigit}>At least one digit</CheckItem>
      <CheckItem isValid={requirements.passwordsMatch}>Both passwords must match</CheckItem>
    </LeftChild>
  )
}

const LeftChild = styled.View`
  align-self: flex-start;
`

export default CheckPassRequirements

import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

interface FormTextProps {
  hint?: string
  children?: React.ReactNode
}
interface FormLinkProps extends FormTextProps {
  href: string
}
interface FormButtonProps extends FormTextProps {
  onPress: () => void
}
interface FormCheckBoxItemProps extends FormTextProps {
  onPress?: () => void
  checked?: boolean
}

export const FormText: React.FC<FormTextProps> = (props) => {
  const { hint, children } = props
  return (
    <Wrapper>
      <Text>{children}</Text>
      <TextHint>{hint}</TextHint>
    </Wrapper>
  )
}

export const FormLink: React.FC<FormLinkProps> = (props) => {
  const { hint, children, href } = props
  return (
    <Link href={href}>
      <Wrapper>
        <Text>{children}</Text>
        <ViewSide>
          {hint && <TextHint>{hint}</TextHint>}
          <Ionicons name="chevron-forward-outline" size={16} color="gray" />
        </ViewSide>
      </Wrapper>
    </Link>
  )
}

export const FormButton: React.FC<FormButtonProps> = (props) => {
  const { hint, children, onPress } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <Wrapper>
        <Text>{children}</Text>
        <ViewSide>
          {hint && <TextHint>{hint}</TextHint>}
          <Ionicons name="chevron-forward-outline" size={16} color="gray" />
        </ViewSide>
      </Wrapper>
    </TouchableOpacity>
  )
}

export const FormAddButton: React.FC<FormButtonProps> = (props) => {
  const { hint, children, onPress } = props
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={onPress}>
      <Centered>
        <Ionicons name="add" size={16} color={theme.colors.primary} />
        {hint && <TextHint>{hint}</TextHint>}
        {children && <Text>{children}</Text>}
      </Centered>
    </TouchableOpacity>
  )
}

export const FormCheckBoxItem: React.FC<FormCheckBoxItemProps> = (props) => {
  const { hint, children, onPress, checked } = props
  const theme = useTheme()
  return (
    <Wrapper>
      <Text>{children}</Text>
      <ViewSide>
        {hint && <TextHint>{hint}</TextHint>}
        <Ionicons
          name={checked ? 'checkbox' : 'square-outline'}
          size={16}
          color={checked ? theme.colors.primary : 'gray'}
          onPress={onPress}
          style={{ paddingLeft: 8 }}
        />
      </ViewSide>
    </Wrapper>
  )
}

const Centered = styled.View`
  align-items: center;
`
const Wrapper = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`
const ViewSide = styled.View`
  flex-direction: row;
  align-items: center;
`
const TextHint = styled.Text`
  color: ${({ theme }) => theme.text.textMuted};
  font-size: 12px;
  align-items: center;
  justify-content: center;
  align-self: center;
  align-content: center;
`

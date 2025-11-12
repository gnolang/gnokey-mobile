import { TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { Spacer, Text } from '@berty/gnonative-ui'

interface FormTextProps {
  hint?: string
  children?: React.ReactNode
}
interface FormLinkProps extends FormTextProps {
  title: string
  onPress: () => void
  description?: string
}
interface FormButtonProps extends FormTextProps {
  title: string
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
      <Text.Body>{children}</Text.Body>
      <TextHint>{hint}</TextHint>
    </Wrapper>
  )
}

export const FormLink: React.FC<FormLinkProps> = (props) => {
  const { description, onPress, title } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <Spacer space={16} />
      <RowSpaced>
        <Text.SubheadlineSemiBold>{title}</Text.SubheadlineSemiBold>
        <Ionicons name="chevron-forward-outline" size={16} color="gray" />
      </RowSpaced>
      <Spacer space={8} />
      <Text.SubheadlineMuted>{description}</Text.SubheadlineMuted>
      <Spacer space={24} />
    </TouchableOpacity>
  )
}

const RowSpaced = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const FormButton: React.FC<FormButtonProps> = (props) => {
  const { title, hint, onPress } = props
  return (
    <TouchableOpacityHorizontal onPress={onPress}>
      {/* <Wrapper> */}
      <Text.Subheadline weight={Text.weights.semibold}>{title}</Text.Subheadline>
      <ViewSide>
        {hint && <TextHint>{hint}</TextHint>}
        <Ionicons name="chevron-forward-outline" size={16} color="gray" />
      </ViewSide>
      {/* </Wrapper> */}
    </TouchableOpacityHorizontal>
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
        {children && <Text.Body>{children}</Text.Body>}
      </Centered>
    </TouchableOpacity>
  )
}

export const FormCheckBoxItem: React.FC<FormCheckBoxItemProps> = (props) => {
  const { hint, children, onPress, checked } = props
  const theme = useTheme()
  return (
    <Wrapper>
      <Text.Body>{children}</Text.Body>
      <ViewSide>
        {hint && <TextHint onPress={onPress}>{hint}</TextHint>}
        <FontAwesome
          name={checked ? 'check-circle' : 'circle-o'}
          size={18}
          color={checked ? theme.colors.primary : 'gray'}
          onPress={onPress}
          style={{ paddingLeft: 8 }}
        />
      </ViewSide>
    </Wrapper>
  )
}

// const styles = StyleSheet.create({
//   content: {
//     alignItems: 'center'
//   }
// })

const Centered = styled.View`
  align-items: center;
`
const TouchableOpacityHorizontal = styled(TouchableOpacity)`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
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

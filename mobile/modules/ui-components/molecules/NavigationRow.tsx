import styled from 'styled-components/native'
import { TextFieldComp } from '../src'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface Props {
  title: string
  description: string
  footer?: React.ReactNode
  onPress: () => void
}

export const NavigationRow = ({ title, description, onPress, footer }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <Row>
          <TextFieldComp.Label>{title}</TextFieldComp.Label>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
        </Row>
        <TextFieldComp.Description>{description}</TextFieldComp.Description>
        {footer}
      </Container>
    </TouchableOpacity>
  )
}

const Container = styled.View`
  flex-direction: column;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

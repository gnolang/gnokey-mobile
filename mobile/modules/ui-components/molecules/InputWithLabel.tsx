import styled, { useTheme } from 'styled-components/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Text } from '../src'

interface Props {
  label: string
  placeholder: string
  onChangeText?: (text: string) => void
  value?: string
  minWidth?: number
  noEdit?: boolean
}

export const InputWithLabel = ({ label, placeholder, onChangeText = () => {}, value, minWidth = 100, noEdit = false }: Props) => {
  const theme = useTheme()

  return (
    <Row>
      <Text.Body style={{ minWidth }}>{label}</Text.Body>
      <RightGroup>
        <TextInputStyled
          numberOfLines={2}
          multiline
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          editable={!noEdit}
        />
        {value && !noEdit ? (
          <MaterialIcons name="highlight-remove" size={24} color={theme.text.textMuted} onPress={() => onChangeText('')} />
        ) : null}
      </RightGroup>
    </Row>
  )
}

const RightGroup = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const TextInputStyled = styled.TextInput`
  flex: 1;
  font-size: 17px;
  font-weight: 400;
  padding-right: 30px;
  min-height: 30px;
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`

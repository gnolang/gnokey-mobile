import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../src'

interface Props {
  isSelected: boolean
  name: string
  onPress: () => void
}

export const NetworkListItem = ({ isSelected, name, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Row>
      <LeftSide>
        {isSelected ? (
          <SelectedCircle>
            <InnerCircle />
          </SelectedCircle>
        ) : (
          <SelectedCircle />
        )}
      </LeftSide>
      <RightSide>
        <Text.Body>{name}</Text.Body>
      </RightSide>
    </Row>
  </TouchableOpacity>
)

const LeftSide = styled.View`
  width: 40px;
  justify-content: center;
  align-items: center;
`

const RightSide = styled.View`
  flex: 1;
  height: 100%;
  justify-content: center;
  border-bottom-width: 0.5px;
  border-color: ${(props) => props.theme.colors.border};
`

const Row = styled.View`
  flex: 1;
  height: 48px;
  flex-direction: row;
  align-items: center;
`

const SelectedCircle = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${(props) => props.theme.text.textMuted};
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`

const InnerCircle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primary};
`

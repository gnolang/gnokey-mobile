import { StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../src'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  isSelected: boolean
  name: string
  onPress: () => void
}

export const NetworkListItem = ({ isSelected, name, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <LeftSide>
        {isSelected ? (
          <SelectedCircleSelected>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </SelectedCircleSelected>
        ) : (
          <SelectedCircleUnselected />
        )}
      </LeftSide>
      <RightSide>
        <Text.Body>{name}</Text.Body>
      </RightSide>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

const LeftSide = styled.View`
  width: 40px;
  justify-content: center;
  align-items: center;
`

const RightSide = styled.View`
  flex: 1;
  justify-content: left;
  border-bottom-width: 0.5px;
  border-color: ${(props) => props.theme.colors.border};
  height: 48px;
  flex-direction: row;
  align-items: center;
`

const SelectedCircleUnselected = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-width: 2px;
  border-color: #c7c7cc;
  background-color: #fff;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`

const SelectedCircleSelected = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #007aff;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`

import { StyleSheet, View } from 'react-native'
import { ModalHeaderOvalIcon } from '../../atoms/Modal'
import styled from 'styled-components/native'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'

export const ModalHeader = ({ children }: React.PropsWithChildren) => (
  <Content>
    <ModalHeaderOvalIcon />
    {children}
  </Content>
)

export const ModalHeaderSearch = ({
  searchQuery,
  onChangeText
}: {
  searchQuery: string
  onChangeText: (query: string) => void
}) => (
  <Content>
    {/* <ModalHeaderOvalIcon /> */}
    {/* <Spacer space={8} /> */}
    <View style={styles.inputContainer}>
      <Ionicons name="search" size={20} color="#8E8E93" style={styles.icon} />
      <BottomSheetTextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#8E8E93"
        value={searchQuery}
        onChangeText={onChangeText}
      />
    </View>
  </Content>
)

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    height: 36,
    width: '100%',
    paddingHorizontal: 8
  },
  icon: {
    marginRight: 6
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 4
  }
})

const Content = styled(View)`
  padding-vertical: 8px;
  align-items: center;
  justify-content: center;
`

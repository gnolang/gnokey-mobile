import { colors } from '@/assets/styles/colors'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

const ModalContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  justify-content: flex-end;
  background-color: gray;
`

const ModalView = styled.View`
  background-color: ${colors.modal.background};
  border-top-end-radius: 16px;
  border-top-start-radius: 16px;
  padding: 14px;
  padding-top: 0px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  elevation: 5;
  shadom-offset: 0px 2px;
  shadow-radius: 4px;
`

const ModalContent: React.FC<ViewProps> = (props: ViewProps) => (
  <View
    style={{
      height: '25%',
      width: '100%',
      backgroundColor: '#25292e',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0
    }}
  >
    <ModalView>{props.children}</ModalView>
  </View>
)

export default ModalContent

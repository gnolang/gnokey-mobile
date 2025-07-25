import { Modal as NativeModal, TouchableWithoutFeedback, View, TouchableHighlight } from 'react-native'
import { ModalHeaderTitle } from './ModalHeader'
import styled, { useTheme } from 'styled-components/native'
import { Text, Button, Spacer } from '@/modules/ui-components'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'

export type Props = {
  title: string
  confirmText?: string
  message: string
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
}

const ModalConfirmDelete = ({ visible, onCancel, onConfirm, title, message, confirmText = 'Confirm', loading }: Props) => {
  const theme = useTheme()

  return (
    <NativeModal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onCancel}>
        <OpaqueBackgroundView>
          <TouchableWithoutFeedback>
            <ModalContent>
              <ModalHeaderTitle title={title} color={theme.error.text} />
              <Spacer space={16} />
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text.H4_Regular style={{ textAlign: 'center' }}>{message}</Text.H4_Regular>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16 }}>
                <Button
                  onPress={onCancel}
                  color="secondary"
                  style={{ width: 110 }}
                  loading={loading}
                  endIcon={<AntDesign name="reload1" size={16} color="black" />}
                >
                  Cancel
                </Button>
                <Button
                  onPress={onConfirm}
                  color="danger"
                  loading={loading}
                  style={{ width: 110 }}
                  endIcon={<FontAwesome6 name="trash-alt" size={16} color="white" />}
                >
                  {confirmText}
                </Button>
              </View>
            </ModalContent>
          </TouchableWithoutFeedback>
        </OpaqueBackgroundView>
      </TouchableWithoutFeedback>
    </NativeModal>
  )
}

const ModalConfirm = ({ visible, onCancel, onConfirm, title, message, confirmText = 'Confirm', loading }: Props) => {
  const theme = useTheme()

  return (
    <NativeModal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onCancel}>
        <OpaqueBackgroundView>
          <TouchableWithoutFeedback>
            <Container>
              <Header>
                <Title>{title}</Title>
                <TouchableHighlight onPress={onCancel} underlayColor="transparent">
                  <Ionicons name="close-circle-outline" size={28} color={theme.colors.gray} />
                </TouchableHighlight>
              </Header>
              <Content>
                <Text.Body style={{ textAlign: 'left' }}>{message}</Text.Body>
              </Content>
              <Footer>
                <Button onPress={onConfirm} color="danger" loading={loading}>
                  {confirmText}
                </Button>
              </Footer>
            </Container>
          </TouchableWithoutFeedback>
        </OpaqueBackgroundView>
      </TouchableWithoutFeedback>
    </NativeModal>
  )
}

const Container = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
`

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 8px;
`

const Title = styled(Text.H4)`
  color: ${(props) => props.theme.colors.black};
  text-align: flex-start;
  margin-bottom: 16px;
`

const Content = styled.View`
  flex: 1;
  align-items: stretch;
  text-align: left;
  padding-bottom: 32px;
`

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  padding-bottom: 16px;
`

const OpaqueBackgroundView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

const ModalContent = styled.View`
  minHeight: '30%',
  width: '100%',
  position: 'absolute',
  bottom: 0,
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20
`

export { ModalConfirmDelete, ModalConfirm }

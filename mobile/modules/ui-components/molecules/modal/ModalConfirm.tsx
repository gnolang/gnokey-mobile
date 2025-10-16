import { Modal as NativeModal, TouchableWithoutFeedback, TouchableHighlight } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { Text, Button } from '@/modules/ui-components'
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

export { ModalConfirm }

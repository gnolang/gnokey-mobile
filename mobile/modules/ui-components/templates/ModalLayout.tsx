import { Modal, View, TouchableWithoutFeedback } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

interface Props {
  header: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
  visible: boolean
  onClose: () => void
}

export const ModalTemplate = ({ header, children, footer, visible, onClose }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <OpaqueBackgroundView>
          <ModalSheet>
            <Header>{header}</Header>
            <Content>{children}</Content>
            <Footer style={{ paddingBottom: Math.max(insets.bottom, 16) }}>{footer}</Footer>
          </ModalSheet>
        </OpaqueBackgroundView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const ModalSheet = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
`

const Header = styled(View)`
  padding-horizontal: 16px;
  border-bottom-width: 0.5px;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-color: ${(props) => props.theme.colors.gray};
`

const Footer = styled(View)`
  padding-horizontal: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled(View)`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`

const OpaqueBackgroundView = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: rgba(233, 232, 232, 0.91);
  align-items: flex-end;
  width: 100%;
`

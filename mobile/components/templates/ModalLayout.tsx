import { Modal, View, TouchableWithoutFeedback } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet'
import { useMemo, useRef } from 'react'

interface Props {
  header: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
  visible: boolean
  onClose: () => void
  points?: BottomSheetProps['snapPoints']
}

export const ModalTemplate = ({ header, children, footer, visible, onClose, points }: Props) => {
  const insets = useSafeAreaInsets()
  const sheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => points || [400, '60%'], [points])

  if (!visible) return null

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <OpaqueBackgroundView>
          <GestureHandlerRootView>
            <ModalContainer>
              <BottomSheet ref={sheetRef} snapPoints={snapPoints} enableDynamicSizing={false}>
                <Header>{header}</Header>
                <Content>{children}</Content>
              </BottomSheet>
            </ModalContainer>
          </GestureHandlerRootView>
          <Footer style={{ paddingBottom: Math.max(insets.bottom, 16) }}>{footer}</Footer>
        </OpaqueBackgroundView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const Header = styled(View)`
  padding-horizontal: 20px;
  border-bottom-width: 0.5px;
  padding-bottom: 8px;
  border-top-right-radius: 12px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`

const Footer = styled(View)`
  padding-horizontal: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled(View)`
  padding-horizontal: 20px;
`

const ModalContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  width: 100%;
`

const OpaqueBackgroundView = styled.View`
  flex: 1;
  width: 100%;
  background-color: rgba(233, 232, 232, 0.91);
`

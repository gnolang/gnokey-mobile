import { Modal as NativeModal, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { ModalHeaderTitle } from './ModalHeader'
import { useTheme } from 'styled-components/native'
import { Text, Button, Spacer } from '@/modules/ui-components'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'

export type Props = {
  title: string
  confirmText?: string
  message: string
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
}

const ModalConfirmDelete = ({ visible, onCancel, onConfirm, title, message, confirmText = 'Confirm' }: Props) => {
  const theme = useTheme()

  return (
    <NativeModal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ModalHeaderTitle title={title} color={theme.error.text} />
              <Spacer space={16} />
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text.Body style={{ textAlign: 'center' }}>{message}</Text.Body>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16 }}>
                <Button
                  onPress={onCancel}
                  color="secondary"
                  style={{ width: 110 }}
                  endIcon={<AntDesign name="reload1" size={16} color="black" />}
                >
                  Cancel
                </Button>
                <Button
                  onPress={onConfirm}
                  color="danger"
                  style={{ width: 110 }}
                  endIcon={<FontAwesome6 name="trash-alt" size={16} color="white" />}
                >
                  {confirmText}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </NativeModal>
  )
}

const ModalConfirm = ({ visible, onCancel, onConfirm, title, message, confirmText = 'Confirm' }: Props) => {
  const theme = useTheme()

  return (
    <NativeModal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ModalHeaderTitle title={title} color={theme.colors.primary} />
              <Spacer space={16} />
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text.Body style={{ textAlign: 'center' }}>{message}</Text.Body>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16 }}>
                <Button onPress={onCancel} color="secondary" endIcon={<AntDesign name="reload1" size={16} color="black" />}>
                  Cancel
                </Button>
                <Button onPress={onConfirm} color="primary" endIcon={<FontAwesome6 name="plus" size={16} color="white" />}>
                  {confirmText}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </NativeModal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    minHeight: '30%',
    width: '100%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  selectBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  selectedText: {
    fontSize: 16
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  closeText: {
    color: 'red',
    fontSize: 16
  }
})

export { ModalConfirmDelete, ModalConfirm }

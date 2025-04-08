import { useEffect, useRef, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Modal, TextInput as RNTextInput, View } from 'react-native'
import Text from '@/components/text'
import TextInput from '@/components/textinput'
import Button from '@/components/button'
import { selectMasterPassword, useAppSelector, useAppDispatch, changeMasterPassword } from '@/redux'
import { Alert, Spacer } from '@/modules/ui-components'
import { ModalHeaderTitle } from '@/components/modal/ModalHeader'

export type Props = {
  visible: boolean
  onClose: (sucess: boolean) => void
}

const ChangeMasterPassword = ({ visible, onClose }: Props) => {
  const [loadingMasterPassword, setLoadingMasterPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [reenterPassword, setReenterPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const masterPassword = useAppSelector(selectMasterPassword)
  const dispatch = useAppDispatch()

  const inputRef = useRef<RNTextInput>(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [visible])

  const onConfirm = async () => {
    if (!password) return

    if (password !== reenterPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!masterPassword) {
      setError('Master password not found.')
      return
    }

    if (currentPassword !== masterPassword) {
      setError('Current password is incorrect.')
      return
    }

    try {
      setLoadingMasterPassword(true)
      await dispatch(changeMasterPassword({ newPassword: password, masterPassword })).unwrap()
      onClose(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoadingMasterPassword(false)
    }
  }

  if (!visible) return null

  return (
    <Modal transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ModalHeaderTitle title="Change Master Password" />

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spacer />
                <TextInput
                  ref={inputRef}
                  placeholder={`Current password`}
                  error={error}
                  secureTextEntry={true}
                  onChangeText={setCurrentPassword}
                />
                <Spacer />
                <Text.BodyMedium>Please, enter the new password:</Text.BodyMedium>

                <TextInput placeholder={`New password`} error={error} secureTextEntry={true} onChangeText={setPassword} />
                <TextInput
                  placeholder={`Reenter password`}
                  error={error}
                  secureTextEntry={true}
                  onChangeText={setReenterPassword}
                />
                <Alert severity="error" message={error} />
                <Button.TouchableOpacity title="Confirm" onPress={onConfirm} variant="primary" loading={loadingMasterPassword} />
                <Button.TouchableOpacity
                  title="Cancel"
                  onPress={() => onClose(false)}
                  variant="secondary"
                  loading={loadingMasterPassword}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ChangeMasterPassword

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
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,

    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around'
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12
  }
})

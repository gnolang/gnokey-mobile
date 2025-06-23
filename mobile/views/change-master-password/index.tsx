import { useState } from 'react'
import { selectMasterPassword, useAppSelector, useAppDispatch, changeMasterPassword } from '@/redux'
import { Alert, Button, Spacer, TextField } from '@/modules/ui-components'
import { View } from 'react-native'

export type Props = {
  onClose: (success: boolean) => void
}

const ChangeMasterPassword = ({ onClose }: Props) => {
  const [loadingMasterPassword, setLoadingMasterPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [reenterPassword, setReenterPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const masterPassword = useAppSelector(selectMasterPassword)
  const dispatch = useAppDispatch()

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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spacer />
      <TextField
        label="Current password"
        placeholder={`Current password`}
        type="password"
        secureTextEntry={true}
        onChangeText={setCurrentPassword}
      />

      <TextField
        label="New password"
        placeholder={`New password`}
        type="password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TextField
        label="Reenter password"
        placeholder={`Reenter password`}
        type="password"
        secureTextEntry={true}
        onChangeText={setReenterPassword}
      />
      <Alert severity="error" message={error} />
      <Button color="primary" onPress={onConfirm} loading={loadingMasterPassword}>
        Update Password
      </Button>
      <Spacer />
      <Button color="primary" onPress={() => onClose(false)} loading={loadingMasterPassword}>
        Cancel
      </Button>
    </View>
  )
}

export default ChangeMasterPassword

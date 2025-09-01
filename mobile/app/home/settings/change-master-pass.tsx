import { useRouter } from 'expo-router'
import { HomeLayout, ScreenHeader } from '@/modules/ui-components'
import { useState } from 'react'
import { selectMasterPassword, useAppSelector, useAppDispatch, changeMasterPassword } from '@/redux'
import { Alert, Button, Spacer, TextField } from '@/modules/ui-components'

const Page = () => {
  const router = useRouter()

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
      onClose()
    } catch (error: any) {
      if (error instanceof Error) {
        setError(JSON.stringify(error.message) || 'An error occurred while changing the master password.')
      } else {
        console.error(error)
        setError(error.toString() || 'An error occurred while changing the master password.')
      }
    } finally {
      setLoadingMasterPassword(false)
    }
  }

  const onClose = () => {
    router.replace('/home/settings/change-master-success')
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="Update Password" />}
      footer={
        <>
          <Button color="primary" onPress={onConfirm} loading={loadingMasterPassword}>
            Update Password
          </Button>
          <Spacer />
          <Button color="secondary" onPress={() => onClose()} loading={loadingMasterPassword}>
            Cancel
          </Button>
        </>
      }
    >
      <>
        <Spacer />
        <TextField
          label="Current password"
          placeholder={`Current password`}
          type="password"
          secureTextEntry={true}
          onChangeText={setCurrentPassword}
        />
        <Spacer space={16} />
        <TextField
          label="New password"
          description="Enter your new master password"
          placeholder="Enter your master password"
          secureTextEntry={true}
          type="password"
          textContentType="newPassword"
          autoComplete="new-password"
          passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
          value={password}
          onChangeText={setPassword}
        />
        <Spacer space={16} />
        <TextField
          placeholder="Confirm your new master password"
          secureTextEntry={true}
          type="password"
          textContentType="newPassword"
          autoComplete="new-password"
          passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
          value={reenterPassword}
          onChangeText={setReenterPassword}
        />
        <Spacer space={16} />
        <Alert severity="error" message={error} />
      </>
    </HomeLayout>
  )
}

export default Page

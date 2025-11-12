import { useRouter } from 'expo-router'
import { CheckPassRequirements, ScreenHeader, TextFieldSecure, TextInputLabel } from '@/modules/ui-components'
import { useState } from 'react'
import { selectMasterPassword, useAppSelector, useAppDispatch, changeMasterPassword } from '@/redux'
import { Alert } from '@/modules/ui-components'
import { Spacer, HomeLayout, Button } from '@/modules/gnonative-ui/dist'
import { TextInputDescription } from '@/modules/ui-components/atoms/input/TextInputDescription'

const Page = () => {
  const router = useRouter()

  const [loadingMasterPassword, setLoadingMasterPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [reenterPassword, setReenterPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [passwordsCompleted, setPasswordsCompleted] = useState<string | undefined>(undefined)

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
          <Button color="primary" onPress={onConfirm} loading={loadingMasterPassword} disabled={!passwordsCompleted}>
            {passwordsCompleted ? 'completed' : '(incomplete)'}
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
        <TextInputLabel>Current Password</TextInputLabel>
        <TextFieldSecure
          placeholder="Current password"
          onSecurePress={() => setSecureTextEntry(!secureTextEntry)}
          secureTextEntry={secureTextEntry}
          onChangeText={setCurrentPassword}
        />

        <Spacer space={32} />

        <TextInputLabel>New Password</TextInputLabel>
        <TextInputDescription>Enter your new master password</TextInputDescription>
        <TextFieldSecure
          placeholder="Enter your master password"
          onSecurePress={() => setSecureTextEntry(!secureTextEntry)}
          secureTextEntry={secureTextEntry}
          textContentType="newPassword"
          autoComplete="new-password"
          passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
          value={password}
          onChangeText={setPassword}
        />
        <Spacer space={16} />
        <TextFieldSecure
          placeholder="Confirm your new master password"
          onSecurePress={() => setSecureTextEntry(!secureTextEntry)}
          secureTextEntry={secureTextEntry}
          textContentType="newPassword"
          autoComplete="new-password"
          passwordRules="minlength:8; required:lower; required:digit; required:uppercase; required:symbol"
          value={reenterPassword}
          onChangeText={setReenterPassword}
        />
        <Spacer space={32} />
        <CheckPassRequirements password={password} confirmPassword={reenterPassword} onChange={(v) => setPasswordsCompleted(v)} />
        <Spacer space={16} />
        <Alert severity="error" message={error} />
      </>
    </HomeLayout>
  )
}

export default Page

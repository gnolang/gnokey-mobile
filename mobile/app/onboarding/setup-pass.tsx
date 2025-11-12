import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, HomeLayout } from '@berty/gnonative-ui'
import { useState } from 'react'
import { createMasterPass, useAppDispatch } from '@/redux'
import { ScreenHeader, SetupPassForm } from '@/components'

export default function Page() {
  const [masterPassword, setMasterPassword] = useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onCreateMasterPassword = async () => {
    if (!masterPassword) {
      Alert.alert('Error', 'Please complete the password setup before proceeding.', [{ text: 'OK' }])
      return
    }

    try {
      await dispatch(createMasterPass({ masterPassword })).unwrap()
      router.push('/onboarding/enable-biometric')
    } catch (error: any) {
      console.error('Failed to create master password:', error)
      Alert.alert('Error', 'Failed to create master password. Please try again.', [{ text: 'OK' }])
      return
    }
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="GKM Account" subtitle="" />}
      footer={
        <Button disabled={!masterPassword} onPress={onCreateMasterPassword}>
          Confirm password
        </Button>
      }
    >
      <SetupPassForm onPasswordDefined={(pass: any) => setMasterPassword(pass)} />
    </HomeLayout>
  )
}

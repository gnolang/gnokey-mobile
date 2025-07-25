import { Alert } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Button, OnboardingLayout } from '@/modules/ui-components'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { SetupPassForm } from '@/modules/ui-components/organisms/SetupPassForm'
import { useState } from 'react'
import { createMasterPass, useAppDispatch } from '@/redux'

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
    <OnboardingLayout
      footer={
        <Button disabled={!masterPassword} onPress={onCreateMasterPassword}>
          Confirm password
        </Button>
      }
    >
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="GKM Account" subtitle="1/2" />
        }}
      />
      <SetupPassForm onPasswordsCompleted={(pass) => setMasterPassword(pass)} />
    </OnboardingLayout>
  )
}

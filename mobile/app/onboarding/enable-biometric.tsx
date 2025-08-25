import { Alert, View } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Button, OnboardingLayout, ScreenHeader, Spacer } from '@/modules/ui-components'
import { enableBiometric, useAppDispatch } from '@/redux'
import { SetupBiometrics } from '@/modules/ui-components/organisms/SetupBiometrics'

export default function Page() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onActivateFaceId = async () => {
    try {
      const res = await dispatch(enableBiometric(true)).unwrap()
      console.log('Biometric enabled successfully: ', res)
      if (res) {
        router.replace('/onboarding/loading-screen')
      }
    } catch (error: any) {
      console.error('Failed to enable biometric:', error)
      Alert.alert('Error', 'Failed to enable biometric authentication. Please try again.', [{ text: 'OK' }])
      return
    }
  }

  const onSkip = async () => {
    router.navigate('/onboarding/loading-screen')
  }

  return (
    <OnboardingLayout
      footer={
        <View>
          <Button onPress={onActivateFaceId}>Activate FaceID</Button>
          <Spacer space={16} />
          <Button onPress={onSkip} color="secondary">
            Skip for now
          </Button>
        </View>
      }
    >
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="GKM Account" subtitle="2/2" />
        }}
      />
      <SetupBiometrics />
    </OnboardingLayout>
  )
}

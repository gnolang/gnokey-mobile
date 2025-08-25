import { Stack, useRouter } from 'expo-router'
import { Button, OnboardingLayout, ScreenHeader } from '@/modules/ui-components'
import { ForgotPassSuccessView } from '@/modules/ui-components/organisms/ForgotPassSuccessView'

export default function Page() {
  const router = useRouter()

  const onCreateAccount = async () => {
    router.navigate('/onboarding')
  }

  return (
    <OnboardingLayout footer={<Button onPress={onCreateAccount}>Create GKM Account</Button>}>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="Forgot password" headerBackVisible={false} />
        }}
      />
      <ForgotPassSuccessView />
    </OnboardingLayout>
  )
}

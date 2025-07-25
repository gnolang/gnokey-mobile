import styled from 'styled-components/native'
import { Stack, useFocusEffect, useRouter } from 'expo-router'
import { OnboardingLayout, Spacer, Text } from '@/modules/ui-components'
import ActivityIndicator from '@/components/atoms/activity-indicator'

export default function Page() {
  const router = useRouter()

  useFocusEffect(() => {
    const timer = setTimeout(() => {
      router.navigate('/welcome')
    }, 3000)

    return () => clearTimeout(timer)
  })

  return (
    <OnboardingLayout>
      <Stack.Screen
        options={{
          header: () => null
        }}
      />
      <Container>
        <ActivityIndicator />
        <Spacer space={64} />
        <Text.H1 style={{ textAlign: 'center' }}>Securing your session...</Text.H1>
      </Container>
    </OnboardingLayout>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

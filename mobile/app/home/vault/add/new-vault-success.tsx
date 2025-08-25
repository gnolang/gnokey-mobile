import { useCallback } from 'react'
import { View } from 'react-native'
import { Button, OnboardingLayout, ScreenHeader, Text } from '@/modules/ui-components'
import { resetState, useAppDispatch } from '@/redux'
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const params = useLocalSearchParams<{ keyName: string }>()

  const keyname = params?.keyName || 'Updated'

  useFocusEffect(
    useCallback(() => {
      dispatch(resetState())
    }, [dispatch])
  )

  return (
    <OnboardingLayout footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title={keyname} headerBackVisible={false} />
        }}
      />

      <Container>
        <Text.LargeTitle>Account Created</Text.LargeTitle>
        <Text.LargeTitle style={{ color: theme.success.text }}>Completed</Text.LargeTitle>
        <Text.Caption>{keyname} has been created successfully!</Text.Caption>
      </Container>
    </OnboardingLayout>
  )
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
`

export default Page

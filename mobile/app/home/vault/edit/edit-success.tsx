import { useCallback } from 'react'
import { View } from 'react-native'
import { Button, OnboardingLayout, Text } from '@/modules/ui-components'
import { resetState, useAppDispatch } from '@/redux'
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const params = useLocalSearchParams()

  const keyname = params?.keyName || ''

  useFocusEffect(
    useCallback(() => {
      dispatch(resetState())
    }, [dispatch])
  )

  return (
    <OnboardingLayout footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title={keyname.toString()} headerBackVisible={false} />
        }}
      />

      <Container>
        <Text.H1>Account Updated</Text.H1>
        <Text.H1 style={{ color: theme.success.text }}>Completed</Text.H1>
        <Text.Caption>{keyname} has been updated successfully.</Text.Caption>
      </Container>
    </OnboardingLayout>
  )
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
`

export default Page

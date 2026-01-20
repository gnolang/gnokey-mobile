import { useCallback } from 'react'
import { ScreenHeader, Template } from '@/components'
import { Button, HomeLayout, Text } from '@berty/gnonative-ui'
import { dismissCommand, useAppDispatch } from '@/redux'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const params = useLocalSearchParams<{ broadcast?: string }>()

  const wasBroadcast = params?.broadcast === 'true'

  useFocusEffect(
    useCallback(() => {
      dispatch(dismissCommand())
    }, [dispatch])
  )

  return (
    <HomeLayout
      header={<ScreenHeader title="Transaction" headerBackVisible={false} />}
      footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}
    >
      <Template.ContainerCenterLeft>
        <Text.LargeTitle>Transaction</Text.LargeTitle>
        <Text.LargeTitle style={{ color: theme.success.text }}>Completed</Text.LargeTitle>
        <Text.Caption>
          {wasBroadcast ? 'The transaction was signed and broadcast successfully.' : 'The transaction was signed successfully.'}
        </Text.Caption>
      </Template.ContainerCenterLeft>
    </HomeLayout>
  )
}

export default Page

import { useCallback } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { Button, HomeLayout, ScreenHeader, Template, Text } from '@/modules/ui-components'
import { resetState, useAppDispatch } from '@/redux'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const params = useLocalSearchParams<{ keyName: string }>()

  const keyname = params?.keyName || 'Your account'

  useFocusEffect(
    useCallback(() => {
      dispatch(resetState())
    }, [dispatch])
  )

  return (
    <HomeLayout
      header={<ScreenHeader title="Account Created" headerBackVisible={false} />}
      footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}
    >
      <Template.ContainerCenterLeft>
        <Text.LargeTitle>Account Created</Text.LargeTitle>
        <Text.LargeTitle style={{ color: theme.success.text }}>Completed</Text.LargeTitle>
        <Text.Caption>{keyname} has been created successfully!</Text.Caption>
      </Template.ContainerCenterLeft>
    </HomeLayout>
  )
}

export default Page

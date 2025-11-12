import { useCallback } from 'react'
import { ScreenHeader, Template } from '@/modules/ui-components'
import { Button, HomeLayout, Text } from '@/modules/gnonative-ui/dist'
import { resetTxState, useAppDispatch } from '@/redux'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const params = useLocalSearchParams()

  const keyname = params?.keyName || ''

  useFocusEffect(
    useCallback(() => {
      dispatch(resetTxState())
    }, [dispatch])
  )

  return (
    <HomeLayout
      header={<ScreenHeader title={keyname.toString()} headerBackVisible={false} />}
      footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}
    >
      <Template.ContainerCenterLeft>
        <Text.LargeTitle>Transfer</Text.LargeTitle>
        <Text.LargeTitle style={{ color: theme.success.text }}>Completed</Text.LargeTitle>
        <Text.Caption>The transfer was successful.</Text.Caption>
      </Template.ContainerCenterLeft>
    </HomeLayout>
  )
}

export default Page

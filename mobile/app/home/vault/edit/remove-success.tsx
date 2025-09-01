import { useCallback } from 'react'
import { Button, HomeLayout, ScreenHeader, Template, Text } from '@/modules/ui-components'
import { resetState, useAppDispatch } from '@/redux'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const params = useLocalSearchParams<{ keyName: string }>()

  const keyname = params?.keyName || ''

  useFocusEffect(
    useCallback(() => {
      dispatch(resetState())
    }, [dispatch])
  )

  return (
    <HomeLayout
      header={<ScreenHeader title={keyname} headerBackVisible={false} />}
      footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}
    >
      <Template.ContainerCenterLeft>
        <Text.H1>{keyname} has been deleted</Text.H1>
        <Text.H1 style={{ color: theme.success.text }}>deleted</Text.H1>
        <Text.Caption>{keyname} has been successfully deleted.</Text.Caption>
      </Template.ContainerCenterLeft>
    </HomeLayout>
  )
}

export default Page

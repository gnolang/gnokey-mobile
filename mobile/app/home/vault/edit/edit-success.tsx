import { useCallback } from 'react'
import { ScreenHeader, Template } from '@/components'
import { Button, HomeLayout, Text } from '@berty/gnonative-ui'
import { resetAddVaultState, useAppDispatch } from '@/redux'
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
      dispatch(resetAddVaultState())
    }, [dispatch])
  )

  return (
    <HomeLayout
      header={<ScreenHeader title={keyname.toString()} headerBackVisible={false} />}
      footer={<Button onPress={() => router.replace('/home')}>Back to account list</Button>}
    >
      <Template.ContainerCenterLeft>
        <Text.LargeTitle>Account Updated</Text.LargeTitle>
        <Text.LargeTitle style={{ color: theme.success.text }}>Completed</Text.LargeTitle>
        <Text.Caption>{keyname} has been updated successfully.</Text.Caption>
      </Template.ContainerCenterLeft>
    </HomeLayout>
  )
}

export default Page

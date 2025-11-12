import { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { ScreenHeader } from '@/modules/ui-components'
import { HomeLayout } from '@berty/gnonative-ui'
import { Form, NetworkForm } from '@/modules/ui-components/organisms/NetworkForm'
import { useAppDispatch, saveChain, setSelectedChain } from '@/redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useLocalSearchParams<{ fromScreen: string | 'NewVault' }>()

  const [loading, setLoading] = useState(false)
  const onSubmit = async (data: Form) => {
    if (!data) {
      Alert.alert('No chain provided')
      return
    }
    try {
      setLoading(true)
      const savedChain = await dispatch(saveChain(data)).unwrap()

      if (params.fromScreen === 'NewVault') {
        await dispatch(setSelectedChain(savedChain))
      }
      // setLoading(false)
      router.back()
    } catch (error) {
      Alert.alert('Error', 'Failed to save chain. Please try again.', [{ text: 'OK' }])
      console.error('Failed to save chain:', error)
      return
    }
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="New Network" subtitle="" />
        }}
      />
      <HomeLayout header={null} footer={null}>
        <NetworkForm onSubmit={onSubmit} loading={loading} />
      </HomeLayout>
    </KeyboardAwareScrollView>
  )
}

export default Page

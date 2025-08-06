import { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { OnboardingLayout } from '@/modules/ui-components'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { Form, NetworkForm } from '@/modules/ui-components/organisms/NetworkForm'
import { useAppDispatch, saveChain, setSelectedChain } from '@/redux'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useLocalSearchParams<{ fromScreen: string | 'NewVault' }>()

  const [loading, setLoading] = useState(false)
  const onSaveChain = async (data: Form) => {
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
    <OnboardingLayout>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="New chain" />
        }}
      />
      {/* <LoadingModal visible={loading} /> */}
      <NetworkForm onSaveChain={onSaveChain} loading={loading} />
    </OnboardingLayout>
  )
}

export default Page

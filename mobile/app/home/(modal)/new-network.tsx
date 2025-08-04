import { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { LoadingModal } from '@/components/loading'
import { OnboardingLayout } from '@/modules/ui-components'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { NetworkForm } from '@/modules/ui-components/organisms/NetworkForm'
import { useAppDispatch, saveChain } from '@/redux'
import { Form } from '@/views/chains/modal/chain-add-modal'

const Page = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const onSaveChain = async (data: Form) => {
    if (!data) {
      Alert.alert('No chain provided')
      return
    }
    try {
      setLoading(true)
      dispatch(saveChain(data)).unwrap()
      setLoading(false)
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
      <LoadingModal visible={loading} />
      <NetworkForm onSaveChain={onSaveChain} />
    </OnboardingLayout>
  )
}

export default Page

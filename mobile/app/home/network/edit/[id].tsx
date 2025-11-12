import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { ScreenHeader, NetworkForm, NetworkFormType } from '@/components'
import { HomeLayout } from '@berty/gnonative-ui'
import { selectChainsAvailable, useAppSelector } from '@/redux'
import { NetworkMetainfo } from '@/types'

const Page = () => {
  const router = useRouter()
  const params = useLocalSearchParams<{ id: string }>()
  const chains = useAppSelector(selectChainsAvailable)

  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<NetworkMetainfo | null>(null)

  const networkId = Number(params?.id)

  useEffect(() => {
    try {
      setLoading(true)
      const c = chains.find((c) => c.id === networkId)
      if (c) {
        setInitialValues(c)
      } else {
        console.warn('No network found with ID:', networkId, chains)
        Alert.alert('Error', 'No network found with the provided ID.', [{ text: 'OK', onPress: () => router.back() }])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading network to edit:', error)
      Alert.alert('Error', 'Failed to load network to edit.', [{ text: 'OK', onPress: () => router.back() }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, chains])

  const onSubmit = async (data: NetworkFormType) => {
    console.log('TODO: edit', data)
  }

  if (loading || !initialValues) {
    return null
  }

  return (
    <HomeLayout header={<ScreenHeader title="Network Details" />} footer={null}>
      <NetworkForm
        onSubmit={onSubmit}
        mode="edit"
        loading={loading}
        initialData={{
          chainName: initialValues?.chainName || '',
          chainId: initialValues?.chainId || '',
          rpcUrl: initialValues?.rpcUrl || '',
          faucetUrl: initialValues?.faucetUrl || ''
        }}
      />
    </HomeLayout>
  )
}

export default Page

import { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { ScreenHeader, NetworkForm, NetworkFormType } from '@/components'
import { Button, HomeLayout } from '@berty/gnonative-ui'
import { deleteChain, selectChainsAvailable, useAppDispatch, useAppSelector } from '@/redux'
import { NetworkMetainfo } from '@/types'

const Page = () => {
  const router = useRouter()
  const params = useLocalSearchParams<{ id: string }>()
  const chains = useAppSelector(selectChainsAvailable)
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<NetworkMetainfo | null>(null)
  const isDeleting = useRef(false)

  const networkId = Number(params?.id)

  const handleDelete = () => {
    if (!initialValues) return

    Alert.alert('Delete Network', `Are you sure you want to delete "${initialValues.chainName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          isDeleting.current = true
          await dispatch(deleteChain(networkId))
          router.back()
        }
      }
    ])
  }

  useEffect(() => {
    // Skip if we're in the process of deleting this network
    if (isDeleting.current) return

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
    <HomeLayout
      header={<ScreenHeader title="Network Details" />}
      footer={
        <Button color="danger" onPress={handleDelete}>
          Delete Network
        </Button>
      }
    >
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

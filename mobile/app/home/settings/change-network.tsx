import { ScrollView } from 'react-native'
import { useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { LoadingModal } from '@/components/loading'
import { Container, Form, SafeAreaView, Spacer } from '@/modules/ui-components'
import { ChainSelectView, NetworkSelectView } from '@/views'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [chainID, setChainID] = useState('')
  const [remote, setRemote] = useState('')

  const { gnonative } = useGnoNativeContext()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        fetchAccountData()
      } catch (error: unknown | Error) {
        console.log(error)
      }
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const fetchAccountData = async () => {
    setLoading(true)
    const chainId = await gnonative.getChainID()
    const remote = await gnonative.getRemote()
    setChainID(chainId)
    setRemote(remote)
    setLoading(false)
  }

  return (
    <Container>
      <SafeAreaView>
        <ScrollView>
          <Spacer />
          <NetworkSelectView />
          <Spacer />
          <LoadingModal visible={loading} />
          <ChainSelectView />
        </ScrollView>
      </SafeAreaView>
    </Container>
  )
}

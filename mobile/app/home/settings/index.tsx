import { ScrollView } from 'react-native'
import { useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { LoadingModal } from '@/components/loading'
import { Container, Form, SafeAreaView, Spacer } from '@/modules/ui-components'
import { selectSelectedChain, useAppSelector } from '@/redux'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [chainID, setChainID] = useState('')
  const [remote, setRemote] = useState('')

  const { gnonative } = useGnoNativeContext()
  const navigation = useNavigation()
  const currentChain = useAppSelector(selectSelectedChain)

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
          <Form.Section title="Chain Info">
            <Form.Link hint={currentChain ? currentChain.chainName : 'undefined'} href="home/settings/change-network">
              Chain Name
            </Form.Link>
            <Form.Text hint={currentChain ? currentChain.chainId : ''}>Chain ID</Form.Text>
            <Form.Text hint={currentChain ? currentChain.gnoAddress : ''}>Remote</Form.Text>
          </Form.Section>
          <Spacer />
          <Form.Section title="Security">
            <Form.Link href="/home/(modal)/change-master-pass">Change master password</Form.Link>
            <Form.Link href="/home/(modal)/logout">Logout</Form.Link>
          </Form.Section>

          <LoadingModal visible={loading} />
        </ScrollView>
      </SafeAreaView>
    </Container>
  )
}

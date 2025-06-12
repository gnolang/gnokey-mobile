import { ScrollView } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { Container, Form, SafeAreaView, Spacer } from '@/modules/ui-components'
import { getCurrentChain, selectCurrentChain, useAppDispatch, useAppSelector } from '@/redux'

export default function Page() {
  const currentChain = useAppSelector(selectCurrentChain)
  const dispatch = useAppDispatch()

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentChain())
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

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
        </ScrollView>
      </SafeAreaView>
    </Container>
  )
}

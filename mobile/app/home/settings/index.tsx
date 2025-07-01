import { Alert, ScrollView } from 'react-native'
import { Container, Form, SafeAreaView, Spacer } from '@/modules/ui-components'
import { selectCurrentChain, selectDevMode, toggleDevMode, useAppDispatch, useAppSelector } from '@/redux'
import { nukeDatabase } from '@/providers/database-provider'

export default function Page() {
  const currentChain = useAppSelector(selectCurrentChain)
  const dispatch = useAppDispatch()
  const devMode = useAppSelector(selectDevMode)

  const deleteDatabase = async () => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to delete the database? All data will be lost.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => nukeDatabase() }
    ])
  }

  return (
    <Container>
      <SafeAreaView>
        <ScrollView>
          <Spacer />
          <Form.Section title="Chain Info">
            <Form.Link hint={currentChain ? currentChain.chainName : 'undefined'} href="home/settings/change-network">
              Label
            </Form.Link>
            <Form.Text hint={currentChain ? currentChain.chainId : ''}>Chain ID</Form.Text>
            <Form.Text hint={currentChain ? currentChain.rpcUrl : ''}>Remote</Form.Text>
            <Form.Text hint={currentChain ? currentChain.faucetUrl : ''}>Faucet API</Form.Text>
            <Form.Text hint={currentChain ? currentChain.faucetPortalUrl : ''}>Faucet Portal</Form.Text>
          </Form.Section>
          <Spacer />
          <Form.Section title="Security">
            <Form.Link href="/home/(modal)/change-master-pass">Change master password</Form.Link>
            <Form.Link href="/home/(modal)/logout">Logout</Form.Link>
          </Form.Section>
          <Spacer />

          <Form.Section title="Advanced">
            <Form.Button onPress={() => deleteDatabase()}>Delete Database</Form.Button>
            <Form.Button onPress={() => dispatch(toggleDevMode())}>Developer Mode {devMode ? 'On' : 'Off'}</Form.Button>
          </Form.Section>
        </ScrollView>
      </SafeAreaView>
    </Container>
  )
}

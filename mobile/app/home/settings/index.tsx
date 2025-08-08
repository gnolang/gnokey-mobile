import { Alert, Platform, ScrollView } from 'react-native'
import { Container, Form, SafeAreaView, Spacer } from '@/modules/ui-components'
import {
  enableBiometric,
  hardReset,
  selectBiometricEnabled,
  selectCurrentChain,
  selectDevMode,
  toggleDevMode,
  useAppDispatch,
  useAppSelector
} from '@/redux'
import { nukeDatabase } from '@/providers/database-provider'

export default function Page() {
  const currentChain = useAppSelector(selectCurrentChain)
  const dispatch = useAppDispatch()
  const devMode = useAppSelector(selectDevMode)
  const isBiometricEnabled = useAppSelector(selectBiometricEnabled)

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

  const confirmReset = () => {
    Alert.alert('Confirm Reset', 'Are you sure you want to reset the app and erase all your data?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => dispatch(hardReset()) }
    ])
  }

  const enableFaceID = async () => {
    dispatch(enableBiometric(true))
  }

  const disableFaceID = async () => {
    Alert.alert('Disable FaceID', 'Are you sure you want to disable FaceID?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => dispatch(enableBiometric(false)) }
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
            {!isBiometricEnabled && Platform.OS === 'ios' && <Form.Button onPress={enableFaceID}>Enable FaceID</Form.Button>}
            {isBiometricEnabled && <Form.Button onPress={disableFaceID}>Disable FaceID</Form.Button>}
          </Form.Section>
          <Spacer />

          <Form.Section title="Advanced">
            <Form.Button onPress={() => deleteDatabase()}>Delete Database</Form.Button>
            <Form.Button onPress={confirmReset}>Hard Reset</Form.Button>
            <Form.Button onPress={() => dispatch(toggleDevMode())}>Developer Mode {devMode ? 'On' : 'Off'}</Form.Button>
          </Form.Section>
        </ScrollView>
      </SafeAreaView>
    </Container>
  )
}

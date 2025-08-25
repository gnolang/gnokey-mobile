import { Alert, ScrollView } from 'react-native'
import { HomeLayout, ScreenHeader, Spacer } from '@/modules/ui-components'
import {
  enableBiometric,
  hardReset,
  selectBiometricEnabled,
  selectCurrentChain,
  selectDevMode,
  useAppDispatch,
  useAppSelector
} from '@/redux'
import { nukeDatabase } from '@/providers/database-provider'
import { Form } from '@/modules/ui-components/molecules'
import { useRouter } from 'expo-router'

export default function Page() {
  const currentChain = useAppSelector(selectCurrentChain)
  const dispatch = useAppDispatch()
  const devMode = useAppSelector(selectDevMode)
  const isBiometricEnabled = useAppSelector(selectBiometricEnabled)
  const router = useRouter()

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
    <HomeLayout contentPadding={20} header={<ScreenHeader title="Settings" />}>
      <ScrollView>
        <Spacer space={16} />
        <Form.Section title="Manage the app">
          <Form.Link
            onPress={() => router.navigate('/home/settings/networks-list')}
            title="Networks list"
            description="Customize your Gno.land networks. Add new ones or tweak existing connections."
          />
          <Form.Link
            onPress={() => router.navigate('/home/settings/security-center')}
            title="Security center"
            description="Update your master password to keep your account secure."
          />
          {/* <Form.Link
            onPress={() => router.navigate('/home/(modal)/change-master-pass')}
            title="Change master password"
            description="Update your master password to keep your account secure."
          /> */}
          <Form.Link
            onPress={() => router.navigate('/home/settings/developer-options')}
            title="Developers options"
            description="Access developer settings and tools."
          />
          <Form.Link
            onPress={() => router.navigate('/home/(modal)/logout')}
            title="Logout"
            description="Log out of your Gno.land account."
          />
        </Form.Section>
        <Spacer />
        {/* <Form.Section title="Security">
          <Form.Link href="/home/(modal)/logout">Logout</Form.Link>
          {!isBiometricEnabled && Platform.OS === 'ios' && <Form.Button onPress={enableFaceID}>Enable FaceID</Form.Button>}
          {isBiometricEnabled && <Form.Button onPress={disableFaceID}>Disable FaceID</Form.Button>}
        </Form.Section>
        <Spacer />

        <Form.Section title="Advanced">
          <Form.Button onPress={() => deleteDatabase()} title="Delete Database">
            Delete Database
          </Form.Button>
          <Form.Button onPress={confirmReset} title="Hard Reset">
            This will erase all data
          </Form.Button>
          <Form.Button onPress={() => dispatch(toggleDevMode())} title="Developer Mode">
            Developer Mode {devMode ? 'On' : 'Off'}
          </Form.Button>
        </Form.Section> */}
      </ScrollView>
    </HomeLayout>
  )

  // return (
  //   <HomeLayout contentPadding={20} header={<ScreenHeader title="Settings" />}>
  //     <ScrollView>
  //       <Spacer />
  //       <Form.Section title="Chain Info">
  //         <Form.Link hint={currentChain ? currentChain.chainName : 'undefined'} href="home/settings/change-network">
  //           Label
  //         </Form.Link>
  //         <Form.Text hint={currentChain ? currentChain.chainId : ''}>Chain ID</Form.Text>
  //         <Form.Text hint={currentChain ? currentChain.rpcUrl : ''}>Remote</Form.Text>
  //         <Form.Text hint={currentChain ? currentChain.faucetUrl : ''}>Faucet API</Form.Text>
  //         <Form.Text hint={currentChain ? currentChain.faucetPortalUrl : ''}>Faucet Portal</Form.Text>
  //       </Form.Section>
  //       <Spacer />
  //       <Form.Section title="Security">
  //         <Form.Link href="/home/(modal)/change-master-pass">Change master password</Form.Link>
  //         <Form.Link href="/home/(modal)/logout">Logout</Form.Link>
  //         {!isBiometricEnabled && Platform.OS === 'ios' && <Form.Button onPress={enableFaceID}>Enable FaceID</Form.Button>}
  //         {isBiometricEnabled && <Form.Button onPress={disableFaceID}>Disable FaceID</Form.Button>}
  //       </Form.Section>
  //       <Spacer />

  //       <Form.Section title="Advanced">
  //         <Form.Button onPress={() => deleteDatabase()}>Delete Database</Form.Button>
  //         <Form.Button onPress={confirmReset}>Hard Reset</Form.Button>
  //         <Form.Button onPress={() => dispatch(toggleDevMode())}>Developer Mode {devMode ? 'On' : 'Off'}</Form.Button>
  //       </Form.Section>
  //     </ScrollView>
  //   </HomeLayout>
  // )
}

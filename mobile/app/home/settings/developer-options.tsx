import { HomeLayout, ScreenHeader, Spacer, Form } from '@/modules/ui-components'
import { useRouter } from 'expo-router'
import { Alert, ScrollView } from 'react-native'
import { hardReset, selectDevMode, toggleDevMode, useAppDispatch, useAppSelector } from '@/redux'
import { nukeDatabase } from '@/providers/database-provider'

const Page: React.FC = () => {
  const router = useRouter()
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

  return (
    <HomeLayout contentPadding={20} header={<ScreenHeader title="Settings" />}>
      <ScrollView>
        <Spacer space={16} />
        <Form.Section title="Developer Options">
          <Form.Link
            onPress={() => router.navigate('/home/(modal)/change-master-pass')}
            title="Change master password"
            description="Update your master password to keep your account secure."
          />
          <Form.Link
            onPress={() => deleteDatabase()}
            title="Delete Database"
            description="Permanently delete all data stored in the app."
          />
          <Form.Link
            onPress={confirmReset}
            title="Hard Reset"
            description="This will erase all data, all keys and preferences."
          />
          <Form.Link
            onPress={() => dispatch(toggleDevMode())}
            title="Developer Mode"
            description={`Toggle developer mode features. Currently ${devMode ? 'ON' : 'OFF'}.`}
          />
        </Form.Section>
      </ScrollView>
    </HomeLayout>
  )
}

export default Page

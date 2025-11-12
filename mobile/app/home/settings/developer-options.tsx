import { ScreenHeader } from '@/modules/ui-components'
import { Form, HomeLayout, Spacer } from '@/modules/gnonative-ui/dist'
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
      { text: 'OK', style: 'destructive', onPress: () => nukeDatabase() }
    ])
  }

  const confirmReset = () => {
    Alert.alert('Confirm Reset', 'Are you sure you want to reset the app and erase all your data?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', style: 'destructive', onPress: () => dispatch(hardReset()) }
    ])
  }

  return (
    <HomeLayout contentPadding={20} header={<ScreenHeader title="Settings" />}>
      <ScrollView>
        <Spacer space={16} />
        <Form.Section title="Developer Options">
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
          {devMode && (
            <Form.Link
              onPress={() => router.navigate('/home/vault/option-phrase/enter-phrase')}
              title="Import Seed Phrase"
              description="Register a new account using a seed phrase."
            />
          )}
        </Form.Section>
      </ScrollView>
    </HomeLayout>
  )
}

export default Page

import { Alert, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenHeader } from '@/modules/ui-components'
import { Form, Spacer, HomeLayout } from '@/modules/gnonative-ui/dist'
import { enableBiometric, selectBiometricEnabled, useAppDispatch, useAppSelector } from '@/redux'

const Page: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isBiometricEnabled = useAppSelector(selectBiometricEnabled)

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
        <Form.Section title="Security Center">
          <Form.Link
            onPress={() => router.navigate('/home/settings/change-master-pass')}
            title="Change master password"
            description="Update your master password to keep your account secure."
          />
          {!isBiometricEnabled && Platform.OS === 'ios' && (
            <Form.Link onPress={enableFaceID} title="Enable FaceID" description="Use FaceID for faster authentication." />
          )}
          {isBiometricEnabled && (
            <Form.Link onPress={disableFaceID} title="Disable FaceID" description="Disable FaceID for authentication." />
          )}
        </Form.Section>
      </ScrollView>
    </HomeLayout>
  )
}

export default Page

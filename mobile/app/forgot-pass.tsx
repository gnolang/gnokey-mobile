import { LoadingModal } from '@/components/loading'
import { Button, Container, Text } from '@/modules/ui-components'
import { hardReset, selectForceAppReset, selectLoadingReset, useAppDispatch } from '@/redux'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Alert, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const loading = useSelector(selectLoadingReset)
  const forceAppReset = useSelector(selectForceAppReset)

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

  useEffect(() => {
    if (forceAppReset) {
      Alert.alert(
        'App Reset Required',
        'For your security, the app must be reset before you can continue.\nPlease close the app.'
      )
    }
  }, [forceAppReset])

  return (
    <>
      <LoadingModal visible={loading} />
      <Container>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text.H1>GnoKey Mobile{loading && ' - Loading...'}</Text.H1>
            <Text.Body style={{ marginTop: 24, textAlign: 'center' }}>
              Forgot your master password?
              {'\n\n'}
              For your security, GnoKey Mobile does not recover your master password.
              {'\n\n'}
              <Text.Body>The only way to regain access is to reset the app and start over.</Text.Body>
              {'\n\n'}
              This will erase all your local data and you will need to set up your keys again.
              {'\n\n'}
              If you have a backup of your keys, you can restore them after resetting.
            </Text.Body>
          </View>
          <Button color="danger" style={{ marginTop: 32 }} onPress={confirmReset}>
            Reset App
          </Button>
          <Button color="secondary" style={{ marginTop: 16 }} onPress={() => router.back()}>
            Cancel
          </Button>
        </SafeAreaView>
      </Container>
    </>
  )
}

import { useNavigation } from 'expo-router'
import { SafeAreaView, Container, Text, Button } from '@/modules/ui-components'
import { signOut, useAppDispatch } from '@/redux'

const Page = () => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const onCancel = (_: boolean) => {
    navigation.goBack()
  }

  const onLogout = () => {
    dispatch(signOut())
  }

  return (
    <>
      <SafeAreaView>
        <Container style={{ flex: 1 }}>
          <Text.Body>Are you sure you want to log out?</Text.Body>
          <Button onPress={() => onCancel(false)} style={{ marginTop: 20 }}>
            Cancel
          </Button>
          <Button onPress={onLogout} style={{ marginTop: 10 }} color="danger">
            Log Out
          </Button>
        </Container>
      </SafeAreaView>
    </>
  )
}

export default Page

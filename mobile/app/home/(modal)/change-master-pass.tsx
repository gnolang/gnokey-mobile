import { useNavigation } from 'expo-router'
import { SafeAreaView, Container } from '@/modules/ui-components'
import ChangeMasterPassword from '@/views/change-master-password'

const Page = () => {
  const navigation = useNavigation()

  const onClose = (_: boolean) => {
    navigation.goBack()
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <TopModalBar /> */}
        <Container style={{ flex: 1 }}>
          <ChangeMasterPassword onClose={() => onClose(false)} />
        </Container>
      </SafeAreaView>
    </>
  )
}

export default Page

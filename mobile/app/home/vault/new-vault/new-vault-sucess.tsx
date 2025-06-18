import { ButtonIcon, SafeAreaView, Text } from '@/modules/ui-components'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  return (
    <SafeAreaView>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 24 }}>
        <Text.H3 style={{ color: theme.success.text }}>Sucess</Text.H3>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center' }}>
        <View>
          <Text.H1>Vault</Text.H1>
          <Text.H1>Creation</Text.H1>
          <Text.H1 style={{ color: theme.success.text }}>Completed</Text.H1>
        </View>

        <Text.Body>You can now use your key!</Text.Body>
      </View>

      <View style={{ justifyContent: 'flex-end', paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <ButtonIcon size={60} color="primary" onPress={() => router.replace('/home')}>
            <Feather name="check" size={30} color="white" />
          </ButtonIcon>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page

import { Layout } from '@/components'
import { ActionItem } from '@/components'
import { View } from 'react-native'
import Fontisto from '@expo/vector-icons/Fontisto'
import { useRouter } from 'expo-router'
import { Text, Ruller, Spacer } from '@berty/gnonative-ui'
import Container from '@/components/layout/container'

export default function Page() {
  const route = useRouter()

  return (
    <Container>
      <Spacer space={32} />
      <Layout.Body>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
          <Text.H3>How do you want to import your wallet?</Text.H3>
        </View>
        <Ruller />
        <ActionItem
          title="Enter recovery phrase"
          subtitle="A combination of 12 to 24 words"
          onPress={() => route.push('/home/vault/option-phrase/enter-phrase')}
          iconLeft={<Fontisto name="nav-icon-grid" size={18} color="black" />}
        />
        <Ruller />
      </Layout.Body>
    </Container>
  )
}

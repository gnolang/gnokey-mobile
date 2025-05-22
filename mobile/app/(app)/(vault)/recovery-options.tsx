import { Layout, Ruller } from '@/components'
import { Text } from '@/modules/ui-components'
import { ActionItem } from '@/modules/ui-components/src/ui/ActionItem'
import { View } from 'react-native'
import Fontisto from '@expo/vector-icons/Fontisto'
import { useRouter } from 'expo-router'

export default function Page() {
  const route = useRouter()

  return (
    <Layout.Container>
      <Layout.Body>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
          <Text.H3>How do you want to import your wallet?</Text.H3>
        </View>
        <Ruller />
        <ActionItem
          title="Enter recovery phrase"
          subtitle="A combination of 12 to 24 words"
          onPress={() => route.navigate('(vault)/option-phrase/enter-phrase')}
          iconLeft={<Fontisto name="nav-icon-grid" size={18} color="black" />}
        />
        <Ruller />
      </Layout.Body>
    </Layout.Container>
  )
}

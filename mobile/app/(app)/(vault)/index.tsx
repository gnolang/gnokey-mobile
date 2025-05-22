import { Layout, Ruller } from '@/components'
import { Text } from '@/modules/ui-components'
import { ActionItem } from '@/modules/ui-components/src/ui/ActionItem'
import { useFocusEffect, useRouter } from 'expo-router'
import { resetState, useAppDispatch } from '@/redux'
import { View } from 'react-native'

export default function Page() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useFocusEffect(() => {
    dispatch(resetState())
  })

  return (
    <Layout.Container>
      <Layout.Header />
      <Layout.Body>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
          <Text.H3>How do you want to start?</Text.H3>
        </View>
        <Ruller />
        <ActionItem
          title="Create a personal vault"
          subtitle="Quick and easy to set up"
          onPress={() => router.navigate('/(vault)/new-vault')}
        />
        <Ruller />
        <ActionItem
          title="Import a wallet."
          subtitle="Recover a wallet you previously used."
          onPress={() => router.navigate('/(vault)/recovery-options')}
        />
        <Ruller />
      </Layout.Body>
    </Layout.Container>
  )
}

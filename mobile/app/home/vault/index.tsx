import { Layout, Ruller } from '@/components'
import { Container } from '@/modules/ui-components'
import { ActionItem } from '@/modules/ui-components/src/ui/ActionItem'
import { useFocusEffect, useRouter } from 'expo-router'
import { resetState, selectDevMode, useAppDispatch, useAppSelector } from '@/redux'
import { View } from 'react-native'

export default function NewVaultPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const devMode = useAppSelector(selectDevMode)

  // const currentRoute = router..split('/').pop() || 'unknown'

  useFocusEffect(() => {
    dispatch(resetState())
  })

  return (
    <Container>
      {/* {Platform.OS === 'ios' ? <Layout.Header /> : null} */}
      <Layout.Body>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}></View>
        <Ruller />
        <ActionItem
          title="Create an Account Key"
          subtitle="Quick and easy to set up"
          onPress={() => router.push('/home/vault/new-vault')}
        />
        <Ruller />
        {devMode && (
          <>
            <ActionItem
              title="Import a wallet."
              subtitle="Recover a wallet you previously used."
              onPress={() => router.push('/home/vault/recovery-options')}
            />
            <Ruller />
          </>
        )}
      </Layout.Body>
    </Container>
  )
}

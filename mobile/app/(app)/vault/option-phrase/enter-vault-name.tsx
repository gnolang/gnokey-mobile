import { Layout } from '@/components'
import { Spacer, Text } from '@/modules/ui-components'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { NewVaultView } from '@/views'
import { useAppSelector, selectLoadingAddVault } from '@/redux'

export default function Page() {
  const router = useRouter()

  const loading = useAppSelector(selectLoadingAddVault)

  const onContinue = () => {
    try {
      router.replace({ pathname: 'vault/new-vault/new-vault-sucess' })
    } catch (error) {
      console.error('Error importing vault:', error)
    }
  }

  if (loading) {
    return (
      <Layout.Container>
        <Layout.Body>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text.H3>Loading...</Text.H3>
          </View>
        </Layout.Body>
      </Layout.Container>
    )
  }

  return (
    <Layout.Container>
      <Layout.Body>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text.H3>Name your Vault</Text.H3>
          <Text.Body>This name helps you identify this key in your wallet.</Text.Body>
          <NewVaultView onSucess={onContinue} />
        </View>
        <Spacer />
      </Layout.Body>
    </Layout.Container>
  )
}

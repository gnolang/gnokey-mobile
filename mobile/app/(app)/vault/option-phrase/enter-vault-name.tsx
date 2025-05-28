import { Layout } from '@/components'
import { Spacer, Text } from '@/modules/ui-components'
import { ActivityIndicator, Modal, View } from 'react-native'
import { useRouter } from 'expo-router'
import { NewVaultView } from '@/views'
import { useAppSelector, selectLoadingAddVault } from '@/redux'
import { useTheme } from 'styled-components/native'

export default function Page() {
  const router = useRouter()
  const theme = useTheme()

  const loading = useAppSelector(selectLoadingAddVault)

  const onContinue = () => {
    try {
      router.replace({ pathname: 'vault/new-vault/new-vault-sucess' })
    } catch (error) {
      console.error('Error importing vault:', error)
    }
  }

  return (
    <>
      <Modal visible={loading} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Modal>
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
    </>
  )
}

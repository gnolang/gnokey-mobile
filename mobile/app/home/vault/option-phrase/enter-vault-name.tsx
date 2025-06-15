import { Spacer, Text, Container } from '@/modules/ui-components'
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
      router.replace({ pathname: 'home/vault/new-vault/new-vault-sucess' })
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
      <Container>
        <Spacer space={64} />
        <>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <Text.H3>Name your Vault</Text.H3> */}
            <Text.Body>Let's name your vault. This name helps you identify this key in your wallet.</Text.Body>
          </View>
          <NewVaultView onSucess={onContinue} />
          <Spacer />
        </>
      </Container>
    </>
  )
}

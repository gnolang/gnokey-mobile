import { Layout } from '@/components'
import { Spacer, Text } from '@/modules/ui-components'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { NewVaultView } from '@/views'

export default function Page() {
  const router = useRouter()

  const onContinue = () => {
    // if (!password) throw new Error('No password found')
    try {
      // await dispatch(addVault({ name: vaultName, password, phrase: seed })).unwrap()
      router.replace({ pathname: '(vault)/new-vault/new-vault-sucess' })
      // route.push('/home')_
    } catch (error) {
      console.error('Error importing vault:', error)
    }
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

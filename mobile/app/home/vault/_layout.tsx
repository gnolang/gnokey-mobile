import { Stack } from 'expo-router'

const defaultOptions = {
  headerTransparent: true,
  headerLargeTitle: false,
  headerShadowVisible: true,
  headerLargeTitleShadowVisible: false,
  headerLargeStyle: {
    backgroundColor: 'transparent'
  }
}

export default function VaultModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Options',
          ...defaultOptions
        }}
      />
      <Stack.Screen name="recovery-options" options={{ ...defaultOptions, title: '' }} />
      {/* <Stack.Screen name="home/vault" options={{ title: 'Vaults vv' }} /> */}

      {/* Create a new vault stack */}
      <Stack.Screen
        name="new-vault/index"
        options={{
          title: 'New Vault',
          ...defaultOptions
        }}
      />
      <Stack.Screen name="new-vault/new-vault-sucess" options={{ ...defaultOptions, title: '', headerBackVisible: false }} />

      {/* Import a vault stack */}
      <Stack.Screen name="option-phrase/enter-phrase" options={{ ...defaultOptions, title: 'Seed Phrase' }} />
      <Stack.Screen name="option-phrase/enter-vault-name" options={{ ...defaultOptions, title: 'Vault name' }} />
      {/* <Stack.Screen name="vault/new-vault/new-vault-sucess" options={{ ...defaultOptions, title: 'd' }} /> */}
    </Stack>
  )
}

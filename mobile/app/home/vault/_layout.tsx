import { Stack } from 'expo-router'

const defaultOptions = {
  headerShown: true
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
        name="add/index"
        options={{
          title: 'New Account Key',
          ...defaultOptions
        }}
      />
      <Stack.Screen name="add/new-vault-success" options={{ ...defaultOptions, title: '', headerBackVisible: false }} />

      {/* Import a vault stack */}
      <Stack.Screen name="option-phrase/enter-phrase" options={{ ...defaultOptions, title: 'Seed Phrase' }} />
    </Stack>
  )
}

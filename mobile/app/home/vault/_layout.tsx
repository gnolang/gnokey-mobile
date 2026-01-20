import { Stack } from 'expo-router'

const defaultOptions = {
  headerShown: false
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

      {/* Create a new vault stack */}
      <Stack.Screen
        name="add/index"
        options={{
          ...defaultOptions
        }}
      />
      <Stack.Screen name="add/external-faucet" options={{ ...defaultOptions }} />
      <Stack.Screen
        name="edit/index"
        options={{
          ...defaultOptions
        }}
      />
      <Stack.Screen
        name="edit/edit-success"
        options={{
          ...defaultOptions
        }}
      />
      <Stack.Screen
        name="edit/remove-success"
        options={{
          ...defaultOptions
        }}
      />
      <Stack.Screen name="add/new-vault-success" options={{ ...defaultOptions, title: '', headerBackVisible: false }} />
      <Stack.Screen
        name="add/new-vault-loading"
        options={{
          ...defaultOptions
        }}
      />
      <Stack.Screen name="add/existing-account" options={{ ...defaultOptions }} />

      {/* Import a vault stack */}
      <Stack.Screen name="option-phrase/enter-phrase" options={{ ...defaultOptions, title: 'Seed Phrase' }} />

      <Stack.Screen name="transfer-funds/index" options={{ ...defaultOptions }} />
      <Stack.Screen name="transfer-funds/confirm" options={{ ...defaultOptions }} />
      <Stack.Screen name="transfer-funds/transfer-success" options={{ ...defaultOptions, title: '', headerBackVisible: false }} />

      <Stack.Screen
        name="command/index"
        options={{
          title: 'Approval Request',
          presentation: 'modal'
        }}
      />
      <Stack.Screen name="command/success" options={{ ...defaultOptions, title: '', headerBackVisible: false }} />
      <Stack.Screen name="command/signed-tx" options={{ ...defaultOptions, title: '', headerBackVisible: false }} />
    </Stack>
  )
}

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

      {/* Import a vault stack */}
      <Stack.Screen name="option-phrase/enter-phrase" options={{ ...defaultOptions, title: 'Seed Phrase' }} />
    </Stack>
  )
}

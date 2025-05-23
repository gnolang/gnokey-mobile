import { Stack } from 'expo-router'
import { useTheme } from 'styled-components/native'

export default function KeysLayout() {
  const theme = useTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitle: '',
        headerShadowVisible: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: true,
          headerLeft: undefined // Force show default back button if available
        }}
      />

      <Stack.Screen
        name="new-vault/new-vault-sucess"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}

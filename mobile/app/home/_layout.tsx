import { Stack } from 'expo-router'

export default function AppLayout() {
  const defaultOptions = {
    headerTransparent: false,
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    headerLargeTitle: false,
    headerShown: false
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="settings/networks-list"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="settings/security-center"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="(modal)/change-master-pass"
        options={{
          title: 'Change master password',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="(modal)/logout"
        options={{
          title: 'Logout',
          presentation: 'modal'
        }}
      />

      <Stack.Screen name="vault" options={{ headerShown: false }} />
    </Stack>
  )
}

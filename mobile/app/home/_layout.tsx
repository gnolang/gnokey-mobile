import { Stack } from 'expo-router'

export default function AppLayout() {
  const defaultOptions = {
    headerTransparent: true,
    headerShadowVisible: true,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: {
      backgroundColor: 'transparent'
    },
    headerLargeTitle: false
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
          headerLargeTitle: true,
          headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          ...defaultOptions
        }}
      />
      <Stack.Screen
        name="settings/change-network"
        options={{
          title: 'Network',
          ...defaultOptions
        }}
      />
      <Stack.Screen
        name="(modal)/vault-detail-modal"
        options={{
          presentation: 'modal'
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

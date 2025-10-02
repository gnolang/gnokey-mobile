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
        name="settings/security-center"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="settings/developer-options"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="settings/change-master-pass"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="settings/change-master-success"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="network/list/index"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="network/edit/[id]"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="network/new/index"
        options={{
          ...defaultOptions,
          headerBackVisible: false,
          headerShown: true
        }}
      />
      <Stack.Screen name="vault" options={{ headerShown: false }} />
    </Stack>
  )
}

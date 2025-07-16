import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { Stack } from 'expo-router'
import { useTheme } from 'styled-components/native'

export default function OnboardingLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerTitle: '',
        contentStyle: { backgroundColor: 'transparent' },
        headerStyle: {
          backgroundColor: theme.colors.backgroundSecondary
        },
        headerShadowVisible: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="setup-pass" />
    </Stack>
  )
}

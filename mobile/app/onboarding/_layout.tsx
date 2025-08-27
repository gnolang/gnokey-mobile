import { Stack } from 'expo-router'
import { useTheme } from 'styled-components/native'

export default function OnboardingLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerTitle: '',
        contentStyle: { backgroundColor: 'transparent' },
        headerStyle: {
          backgroundColor: theme.colors.backgroundSecondary
        },
        headerShadowVisible: false
      }}
    />
  )
}

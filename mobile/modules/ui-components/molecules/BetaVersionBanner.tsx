import { View } from 'react-native'
import { Text } from '@/modules/ui-components'
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const BetaVersionHeader = () => {
  const insets = useSafeAreaInsets()
  const marginTop = insets.top || 20

  return (
    <View
      style={{
        marginTop
      }}
    >
      <BetaVersionBanner />
    </View>
  )
}

const BetaVersionBanner = () => {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#FFD700',
        alignItems: 'center'
      }}
    >
      <Text.Body style={{ color: '#000', textAlign: 'center' }}>
        This app is under development. No guarantee of security can be asserted.{'\n'}
        <Text.Body style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
          Do not use for transactions involving real assets or sensitive information.
        </Text.Body>
      </Text.Body>
    </View>
  )
}

export const BetaVersionMiniBanner = () => {
  const theme = useTheme()
  return (
    <View
      style={{
        backgroundColor: '#FFD700',
        alignItems: 'center',
        borderRadius: theme.borderRadius
      }}
    >
      <Text.Callout style={{ color: 'red', textAlign: 'center' }}>
        BETA Version of GnoKey Mobile{'\n'}Do not use for real assets
      </Text.Callout>
    </View>
  )
}

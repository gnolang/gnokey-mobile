import { Text } from '@/modules/ui-components'
import { View } from 'react-native'

export const BetaVersionBanner = () => {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#FFD700',
        paddingVertical: 6,
        alignItems: 'center',
        zIndex: 1000,
        top: 16
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

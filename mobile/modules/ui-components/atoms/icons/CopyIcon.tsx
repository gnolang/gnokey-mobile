import { Octicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

export const CopyIcon = () => {
  const theme = useTheme()
  return (
    <View style={{ paddingLeft: 4 }}>
      <Octicons name="copy" size={12} color={theme.colors.primary} />
    </View>
  )
}

import { Octicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

const CopyIcon: React.FC<{ muted?: boolean }> = ({ muted = false }) => {
  const theme = useTheme()
  return (
    <View style={{ paddingLeft: 4 }}>
      <Octicons name="copy" size={18} color={muted ? theme.text.textMuted : theme.colors.primary} />
    </View>
  )
}

export default CopyIcon

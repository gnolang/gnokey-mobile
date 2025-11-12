import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@berty/gnonative-ui'

type Props = {
  onPress: () => void
  label: string
  icon?: React.ComponentProps<typeof Ionicons>['name']
}

const HeaderActionButton: React.FC<Props> = ({ onPress, label, icon }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      {icon && <Ionicons name={icon} size={20} color="#007aff" />}
      <Text.LinkHeader>{label}</Text.LinkHeader>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  }
})

export default HeaderActionButton

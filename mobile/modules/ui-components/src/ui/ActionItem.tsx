import { TouchableOpacity, View } from 'react-native'
import { Text } from '..'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface Props {
  onPress: () => void
  title: string
  subtitle: string
  iconLeft?: React.ReactNode
}

export const ActionItem: React.FC<Props> = ({ onPress, title, subtitle, iconLeft }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      {iconLeft}
      <View style={{ flex: 1, paddingLeft: iconLeft ? 18 : 0 }}>
        <Text.Body5>{title}</Text.Body5>
        <Text.Body6 style={{ color: '#4a4949', paddingTop: 2 }}>{subtitle}</Text.Body6>
      </View>
      <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
    </TouchableOpacity>
  )
}

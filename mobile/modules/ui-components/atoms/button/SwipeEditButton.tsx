import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { Text } from '../../src'

const SwipeEditButton = ({ label, color, onPress }: { label: string; color: string; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        width: 75,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text.Body style={{ color: 'white', fontWeight: '600' }}>{label}</Text.Body>
    </TouchableOpacity>
  )
}

export default SwipeEditButton

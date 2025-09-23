import { Ionicons } from '@expo/vector-icons'
import { ActionSheetIOS, Pressable } from 'react-native'

type Props = {
  onTransfer: () => void
  onDelete: () => void
  onRefreshBalance: () => void
}

const VaultOptionsButton = (props: Props) => {
  const { onTransfer, onDelete, onRefreshBalance } = props
  return (
    <Pressable
      onPress={() => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Refresh Balance', 'Transfer', 'Delete'],
            destructiveButtonIndex: 3,
            cancelButtonIndex: 0
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              onRefreshBalance()
            } else if (buttonIndex === 2) {
              onTransfer()
            } else if (buttonIndex === 3) {
              onDelete()
            }
          }
        )
      }}
    >
      <Ionicons name="ellipsis-horizontal" size={24} color="black" />
    </Pressable>
  )
}

export default VaultOptionsButton

import { Ionicons } from '@expo/vector-icons'
import { ActionSheetIOS, Pressable } from 'react-native'

type Props = {
  onTransfer: () => void
  onDelete: () => void
  onRefreshBalance: () => void
  isDevMode?: boolean
}

const VaultOptionsButton = (props: Props) => {
  const { onTransfer, onDelete, onRefreshBalance, isDevMode } = props

  const options = ['Cancel', 'Refresh Balance']
  if (isDevMode) options.push('Transfer')
  options.push('Delete')

  return (
    <Pressable
      onPress={() => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            destructiveButtonIndex: options.length - 1,
            cancelButtonIndex: 0
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              onRefreshBalance()
            } else if (isDevMode && buttonIndex === 2) {
              onTransfer()
            } else if ((isDevMode && buttonIndex === 3) || (!isDevMode && buttonIndex === 2)) {
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

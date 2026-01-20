import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { useState } from 'react'
import CustomActionSheet from '../CustomActionSheet'

type Props = {
  onTransfer: () => void
  onDelete: () => void
  onRefreshBalance: () => void
  onPasteGnokeyCommand: () => void
  isDevMode?: boolean
}

const VaultOptionsButton = (props: Props) => {
  const { onTransfer, onDelete, onRefreshBalance, onPasteGnokeyCommand, isDevMode } = props
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const buildOptions = () => {
    const options = [
      {
        text: 'Refresh Balance',
        onPress: onRefreshBalance,
        isCancel: false,
        isDestructive: false
      },
      {
        text: 'Paste Gnokey command',
        onPress: onPasteGnokeyCommand
      }
    ]

    if (isDevMode) {
      options.push({
        text: 'Transfer',
        onPress: onTransfer,
        isCancel: false,
        isDestructive: false
      })
    }

    options.push({
      text: 'Delete',
      onPress: onDelete,
      isDestructive: true,
      isCancel: false
    })

    options.push({
      text: 'Cancel',
      onPress: () => {},
      isCancel: true,
      isDestructive: false
    })

    return options
  }

  const handlePress = () => {
    setIsSheetOpen(true)
  }

  return (
    <>
      <Pressable onPress={handlePress}>
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
      </Pressable>

      <CustomActionSheet visible={isSheetOpen} options={buildOptions()} onClose={() => setIsSheetOpen(false)} />
    </>
  )
}

export default VaultOptionsButton

import React from 'react'
import { Modal, Pressable, Dimensions, StyleSheet, View } from 'react-native'
import { Button } from '../src'
import { useTheme } from 'styled-components/native'

type ActionSheetOption = {
  text: string
  onPress: () => void
  isDestructive?: boolean
}

type CustomActionSheetProps = {
  visible: boolean
  options: ActionSheetOption[]
  onClose: () => void
}

const { width: screenWidth } = Dimensions.get('window')

const CustomActionSheet: React.FC<CustomActionSheetProps> = ({ visible, options, onClose }) => {
  const theme = useTheme()

  const handleOptionPress = (option: ActionSheetOption) => {
    onClose()
    setTimeout(() => option.onPress(), 150)
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.centerContainer} pointerEvents="box-none">
          <Pressable
            style={[styles.actionSheet, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <Button
                key={index}
                color={option.isDestructive ? 'dangersecondary' : 'secondary'}
                onPress={() => handleOptionPress(option)}
              >
                {option.text}
              </Button>
            ))}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  actionSheet: {
    width: screenWidth - 50,
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20
  }
})

export default CustomActionSheet

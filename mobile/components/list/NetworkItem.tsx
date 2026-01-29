import React from 'react'
import { ActionSheetIOS, Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { NetworkMetainfo } from '@/types'
import { Ruller, Text } from '@berty/gnonative-ui'

interface Props {
  network: NetworkMetainfo
  onEdit: (network: NetworkMetainfo) => void
  onDelete: (network: NetworkMetainfo) => void
}

export const NetworkItem: React.FC<Props> = ({ network, onEdit, onDelete }) => {
  const handlePress = () => {
    onEdit(network)
  }

  const handleLongPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Network'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: network.chainName
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onDelete(network)
          }
        }
      )
    } else {
      Alert.alert(network.chainName, 'What would you like to do?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Network', style: 'destructive', onPress: () => onDelete(network) }
      ])
    }
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        <View style={styles.content}>
          <Text.Body>{network.chainName}</Text.Body>
          <Text.Caption style={styles.chainId}>{network.chainId}</Text.Caption>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
      </TouchableOpacity>
      <Ruller />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    minHeight: 52
  },
  content: {
    flex: 1,
    marginRight: 12
  },
  chainId: {
    marginTop: 2
  }
})

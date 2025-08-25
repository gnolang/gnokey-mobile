import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { SwipeEditButton } from '../atoms'
import { NetworkMetainfo } from '@/types'
import { Text } from '../src'

interface Props {
  network: NetworkMetainfo
  onEdit: (network: NetworkMetainfo) => void
  onDelete: (network: NetworkMetainfo) => void
  showSwipeActions?: boolean
}

export const NetworkItem: React.FC<Props> = ({ network, onEdit, onDelete, showSwipeActions = true }) => {
  const swipeableRef = useRef(null)

  const handleEdit = () => {
    // @ts-ignore
    swipeableRef?.current?.close()
    onEdit(network)
  }

  const handleDelete = () => {
    // @ts-ignore
    swipeableRef?.current?.close()
    onDelete(network)
  }

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      console.log('showRightProgress:', prog.value)
      console.log('appliedTranslation:', drag.value)

      return {
        transform: [{ translateX: drag.value + 140 }]
      }
    })

    return (
      <Reanimated.View style={[styleAnimation, { flexDirection: 'row' }]}>
        <SwipeEditButton label="Edit" color="#007aff" onPress={handleEdit} />
        <SwipeEditButton label="Delete" color="#ff3b30" onPress={handleDelete} />
      </Reanimated.View>
    )
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={styles.swipeable}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
    >
      <View style={styles.rowContent}>
        <Text.Body>{network.chainName}</Text.Body>
        <Text.SubheadlineMuted>{network.chainId}</Text.SubheadlineMuted>
      </View>
    </ReanimatedSwipeable>
  )
}

const styles = StyleSheet.create({
  swipeable: {
    height: 52,
    alignItems: 'center'
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    height: '100%'
  }
})

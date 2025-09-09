import React, { useRef } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { Ruller, SwipeEditButton } from '../atoms'
import { NetworkMetainfo } from '@/types'
import { Text } from '../src'

interface Props {
  network: NetworkMetainfo
  onEdit: (network: NetworkMetainfo) => void
  onDelete: (network: NetworkMetainfo) => void
}

export const NetworkItem: React.FC<Props> = ({ network, onEdit, onDelete }) => {
  const swipeableRef = useRef<any>(null)

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
      // console.log('showRightProgress:', prog.value)
      // console.log('appliedTranslation:', drag.value)

      return {
        transform: [{ translateX: drag.value + 160 }]
      }
    })

    return (
      <Reanimated.View style={[styleAnimation, { flexDirection: 'row' }]}>
        <SwipeEditButton label="View" color="#007aff" onPress={handleEdit} />
        <SwipeEditButton label="Delete" color="#ff3b30" onPress={handleDelete} />
      </Reanimated.View>
    )
  }

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeableRef}
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
      >
        <TouchableOpacity style={styles.rowContent} activeOpacity={0.7} onPress={() => swipeableRef.current?.openRight()}>
          <Text.Body>{network.chainName}</Text.Body>
          <Text.SubheadlineMuted>{network.chainId}</Text.SubheadlineMuted>
        </TouchableOpacity>
      </ReanimatedSwipeable>
      <Ruller />
    </>
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
    height: '100%'
  }
})

import { Button, FormItem, Text } from '@/modules/ui-components'
import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native'
import { BroadcastingLayout } from './broadcastingLayout'

interface Props {
  txResponse?: string
  onDone: () => void
}

export function BroadcastingSuccessView({ txResponse = '0x123...abcd', onDone = () => null }: Props) {
  const progress = useRef(new Animated.Value(0)).current
  const flyOut = useRef(new Animated.Value(0)).current
  const [showDetails, setShowDetails] = useState(false)

  const coinColorA = '#627eea'
  const coinColorB = '#2ecc71'

  useEffect(() => {
    Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(flyOut, {
        toValue: 1,
        duration: 600,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true
      })
    ]).start(() => {
      setShowDetails(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const coin1Translate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0]
  })

  const coin2Translate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0]
  })

  const mergedCoinTranslateY = flyOut.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0]
  })

  const opacityOut = flyOut.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3]
  })

  return (
    <BroadcastingLayout
      title="Transfer Successful"
      iconView={
        <View style={styles.coinContainer}>
          <Animated.View
            style={[
              styles.coin,
              {
                backgroundColor: coinColorA,
                transform: [{ translateX: coin1Translate }],
                opacity: opacityOut
              }
            ]}
          />
          <Animated.View
            style={[
              styles.coin,
              {
                backgroundColor: coinColorB,
                transform: [{ translateX: coin2Translate }],
                opacity: opacityOut
              }
            ]}
          />
          <Animated.View
            style={[
              styles.coinMerged,
              {
                backgroundColor: coinColorB,
                transform: [{ translateY: mergedCoinTranslateY }]
              }
            ]}
          >
            <Text.Body style={styles.check}>✓</Text.Body>
          </Animated.View>
        </View>
      }
      details={
        showDetails && (
          <FormItem label="Transaction Hash">
            <Text.Body style={styles.whiteText}>{txResponse}</Text.Body>
          </FormItem>
        )
      }
      actions={
        <Button color="primary" onPress={onDone}>
          <Text.Body style={styles.buttonText}>Done</Text.Body>
        </Button>
      }
    />
  )
}

const styles = StyleSheet.create({
  coinContainer: {
    width: 160,
    height: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  coin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute'
  },
  coinMerged: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  check: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24
  },
  whiteText: {
    color: 'white'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  }
})

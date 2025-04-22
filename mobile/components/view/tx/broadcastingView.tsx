import React, { useRef, useEffect } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { BroadcastingLayout } from './broadcastingLayout'

export function BroadcastingView({ coinColorA = '#627eea', coinColorB = '#f39c12' }) {
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const coin1Translate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 60]
  })

  const coin2Translate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, -60]
  })

  return (
    <BroadcastingLayout
      title="Transaction in Progress..."
      iconView={
        <>
          <Animated.View
            style={[
              styles.coin,
              {
                backgroundColor: coinColorA,
                transform: [{ translateX: coin1Translate }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.coin,
              {
                backgroundColor: coinColorB,
                transform: [{ translateX: coin2Translate }]
              }
            ]}
          />
        </>
      }
    />
  )
}

const styles = StyleSheet.create({
  coin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute'
  }
})

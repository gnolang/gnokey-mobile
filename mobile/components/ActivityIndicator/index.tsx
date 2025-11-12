import React, { useEffect, useRef } from 'react'
import { View, Animated, Easing } from 'react-native'

const ActivityIndicator = ({ size = 172, strokeWidth = 7, color = '#007AFF', backgroundColor = '#E0E0E0' }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startRotation = () => {
      rotateAnim.setValue(0)
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      }).start(() => startRotation())
    }

    startRotation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background circle */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: backgroundColor
        }}
      />

      {/* Animated progress arc */}
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }]
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: color
          }}
        />
      </Animated.View>
    </View>
  )
}

export default ActivityIndicator

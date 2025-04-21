import { Button, Text } from '@/modules/ui-components'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Easing, ActivityIndicator } from 'react-native'
import { BroadcastingLayout } from './broadcastingLayout'

export function BroadcastingUndefinedView({ message = 'Waiting for confirmation...', onCancel = () => {} }) {
  const floatAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [showCancel, setShowCancel] = useState(false)
  const [txtMessage, setTxtMessage] = useState(message)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCancel(true)
      loop.stop()
    }, 7000)

    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -10,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ])
    )
    loop.start()

    return () => {
      clearTimeout(timeout)
      loop.stop()
      setTxtMessage('Unknown Status')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BroadcastingLayout
      title={txtMessage}
      iconView={
        <>
          <Animated.View
            style={[
              styles.iconView,
              {
                transform: [{ translateY: floatAnim }, { scale: scaleAnim }]
              }
            ]}
          >
            <Text.Body style={styles.questionMark}>?</Text.Body>
          </Animated.View>
        </>
      }
      actions={
        showCancel ? (
          <Button color="primary" onPress={onCancel}>
            Cancel
          </Button>
        ) : (
          <ActivityIndicator size="large" color="#aaa" style={{ marginTop: 20 }} />
        )
      }
    />
  )
}

const styles = StyleSheet.create({
  iconView: {
    backgroundColor: '#f1c40f',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  questionMark: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold'
  }
})

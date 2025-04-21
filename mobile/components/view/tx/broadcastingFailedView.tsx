import { Button, PrettyJSON, Spacer, Text } from '@/modules/ui-components'
import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, Easing, StyleSheet, Vibration } from 'react-native'

interface Prop {
  onCancel: () => void
  txResponse?: string
}

export function BroadcastingFailedView({ onCancel = () => {}, txResponse = '' }: Prop) {
  const shakeAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  const [details, showDetails] = useState(false)

  useEffect(() => {
    Vibration.vibrate(500)

    Animated.sequence([
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(shakeAnim, {
            toValue: 6,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(shakeAnim, {
            toValue: -6,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          })
        ])
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      })
    ]).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.xCircle,
            {
              transform: [{ translateX: shakeAnim }, { scale: scaleAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <Text.Body style={styles.statusText}>✕</Text.Body>
        </Animated.View>
      </View>
      <Text.Body style={styles.statusText}>Transaction Failed</Text.Body>
      <Spacer space={56} />
      <Button color="tertirary" onPress={() => showDetails(!details)}>
        Show details...
      </Button>

      {details && <PrettyJSON data={JSON.parse(txResponse)} />}

      <View style={styles.middleScreen}>
        <View style={styles.botton}>
          <Button color="primary" onPress={onCancel}>
            Try Again
          </Button>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120
  },
  middleScreen: {
    flex: 1,
    alignContent: 'flex-end',
    marginTop: 42
  },
  center: {
    alignItems: 'center',
    textAlign: 'center'
  },
  failedText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10
  },
  xCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#e74c3c',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  botton: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'flex-end'
  }
})

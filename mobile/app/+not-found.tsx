import { Text } from '@/modules/ui-components'
import { Link, Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text.Body>This screen does not exist.</Text.Body>
        <Link href="/" style={styles.link}>
          <Text.Caption>Go to home screen!</Text.Caption>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: '#2e78b7',
    textDecorationLine: 'underline'
  }
})

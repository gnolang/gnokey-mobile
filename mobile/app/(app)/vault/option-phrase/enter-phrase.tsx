import { Button, Spacer, Text, Container } from '@/modules/ui-components'
import { useState, useRef } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { SeedInputs } from '@/views'
import { useAppDispatch, setPhrase, resetState, checkPhrase } from '@/redux'
import { useRouter, useFocusEffect } from 'expo-router'

export default function Page() {
  const [menomicLength, setMenomicLength] = useState<12 | 24>(12)

  const dispatch = useAppDispatch()
  const route = useRouter()
  const hasReset = useRef(false)

  useFocusEffect(() => {
    if (!hasReset.current) {
      dispatch(resetState())
      hasReset.current = true
    }
  })

  const pasteClipboard = async () => {
    const v = await Clipboard.getString()
    dispatch(setPhrase(v))

    if (v.length > 0 && v.split(' ').length === 24) {
      setMenomicLength(24)
    }
  }

  const onContinue = async () => {
    const { invalid, message } = await dispatch(checkPhrase()).unwrap()
    if (invalid) {
      Alert.alert('Invalid seed phrase', message)
      return
    }

    route.push('/vault/option-phrase/enter-vault-name')
  }

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 240}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingBottom: 220
              }}
              keyboardShouldPersistTaps="handled"
              style={styles.container}
            >
              <Text.H3>Enter your seed phrase</Text.H3>
              <View style={styles.actions}>
                <Button color="tertirary" onPress={() => setMenomicLength(12)}>
                  {'12 words'}
                </Button>
                <Spacer spaceH={8} />
                <Button color="tertirary" onPress={() => setMenomicLength(24)}>
                  {'24 words'}
                </Button>
                <Spacer spaceH={8} />
                <Button color="tertirary" onPress={() => dispatch(resetState())}>
                  Clear
                </Button>
              </View>
              <View style={styles.container}>
                <SeedInputs length={menomicLength} />
              </View>
              <View style={styles.footer}>
                <Button color="tertirary" onPress={pasteClipboard}>
                  Paste
                </Button>
                <Spacer />
                <Button color="primary" onPress={onContinue}>
                  Continue
                </Button>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actions: { flexDirection: 'row', padding: 16, justifyContent: 'center' },
  footer: { width: '100%', flexDirection: 'column', justifyContent: 'center' }
})

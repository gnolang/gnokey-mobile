import { Button, Spacer, Text, Container, SafeAreaView } from '@/modules/ui-components'
import { useState, useRef } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { SeedInputs } from '@/views'
import { useAppDispatch, setPhrase, resetState, checkPhrase } from '@/redux'
import { useRouter, useFocusEffect } from 'expo-router'
import styled from 'styled-components/native'

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

    route.push('/home/vault/option-phrase/enter-vault-name')
  }

  return (
    <Container>
      <SafeAreaView>
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
                <SmallButton color="secondary" onPress={() => setMenomicLength(12)}>
                  {'12 words'}
                </SmallButton>
                <Spacer spaceH={8} />
                <SmallButton color="secondary" onPress={() => setMenomicLength(24)}>
                  {'24 words'}
                </SmallButton>
                <Spacer spaceH={8} />
                <SmallButton color="secondary" onPress={() => dispatch(resetState())}>
                  Clear
                </SmallButton>
              </View>
              <View style={styles.container}>
                <SeedInputs length={menomicLength} />
              </View>
              <View style={styles.footer}>
                <Button color="secondary" onPress={pasteClipboard}>
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

const SmallButton = styled(Button)`
  width: 100px;
`

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actions: { flexDirection: 'row', padding: 16, justifyContent: 'center' },
  footer: { width: '100%', flexDirection: 'column', justifyContent: 'center' }
})

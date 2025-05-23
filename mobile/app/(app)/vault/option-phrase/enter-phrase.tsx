import { Layout } from '@/components'
import { Button, Spacer, Text } from '@/modules/ui-components'
import { useState, useRef } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { SeedInputs } from '@/views'
import { useAppDispatch, setPhrase, resetState, useAppSelector, checkPhrase } from '@/redux'
import { useRouter, useFocusEffect } from 'expo-router'

export default function Page() {
  const [menomicLength, setMenomicLength] = useState<12 | 24>(12)

  const dispatch = useAppDispatch()
  const route = useRouter()
  const hasReset = useRef(false)

  const seed = useAppSelector

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
    <Layout.Container>
      <Layout.Body>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text.H3>Enter your seed phrase</Text.H3>
            <View style={{ flexDirection: 'row', paddingTop: 16, paddingBottom: 8 }}>
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
          </View>
          <SeedInputs length={menomicLength} />
          <Button color="tertirary" onPress={pasteClipboard}>
            Paste
          </Button>
          <Spacer />
          <Button color="primary" onPress={onContinue}>
            Continue
          </Button>
        </ScrollView>
      </Layout.Body>
    </Layout.Container>
  )
}

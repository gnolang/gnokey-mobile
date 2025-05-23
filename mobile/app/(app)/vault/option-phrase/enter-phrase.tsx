import { Layout } from '@/components'
import { Button, Spacer, Text } from '@/modules/ui-components'
import { useState, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { SeedInputs } from '@/modules/ui-components/src/seed-input/SeedInputs'
import { useAppDispatch, useAppSelector, setPhrase, selectPhrase, resetState } from '@/redux'
import { useRouter, useFocusEffect } from 'expo-router'

export default function Page() {
  const [menomicLength, setMenomicLength] = useState<12 | 24>(12)

  const seed = useAppSelector(selectPhrase)
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
          <Button color="primary" onPress={() => route.push('/vault/option-phrase/enter-vault-name')}>
            Continue
          </Button>
        </ScrollView>
      </Layout.Body>
    </Layout.Container>
  )
}

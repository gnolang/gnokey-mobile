import { Layout } from '@/components'
import { Button, Spacer, Text } from '@/modules/ui-components'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { SeedInputs } from '@/modules/ui-components/src/seed-input/SeedInputs'
import { useAppDispatch, useAppSelector, setPhrase, selectPhrase } from '@/redux'
import { useRouter } from 'expo-router'

export default function Page() {
  const [menomicLength, setMenomicLength] = useState<12 | 24>(12)

  const seed = useAppSelector(selectPhrase)
  const dispatch = useAppDispatch()
  const route = useRouter()

  const pasteClipboard = async () => {
    const v = await Clipboard.getString()
    console.log('Clipboard', v)
    dispatch(setPhrase(v))

    if (v.length > 0 && v.split(' ').length === 24) {
      setMenomicLength(24)
    }
  }

  const onChange = (value: string) => {
    dispatch(setPhrase(value))
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
              <Button color="tertirary" onPress={() => setMenomicLength(24)}>
                {'24 words'}
              </Button>
            </View>
          </View>
          <SeedInputs length={menomicLength} initialValue={seed || ''} onChange={onChange} />
          <Button color="tertirary" onPress={pasteClipboard}>
            Paste
          </Button>
          <Spacer />
          <Button color="primary" onPress={() => route.push('/(vault)/option-phrase/enter-vault-name')}>
            Continue
          </Button>
        </ScrollView>
      </Layout.Body>
    </Layout.Container>
  )
}

import { HomeLayout } from '@/modules/gnonative-ui/src'
import {
  selectClipboardCommandLoading,
  selectEstimatedTxCommandValue,
  selectParsedCommand,
  signTxCommand,
  useAppSelector
} from '@/redux'
import { View } from 'react-native'
import { Text, Spacer, Ruller, FormItem, Button } from '@berty/gnonative-ui'
import { ScrollView } from 'react-native-gesture-handler'
import { BetaVersionMiniBanner, Collapsable, formatter, Icons, LoadingModal } from '@/components'
import { useRouter } from 'expo-router'
import { useAppDispatch } from '@/redux'
import { LoadingSkeleton } from '@/components/skeleton'

export default function Modal() {
  const command = useAppSelector(selectParsedCommand)
  const loading = useAppSelector(selectClipboardCommandLoading)
  const estimated = useAppSelector(selectEstimatedTxCommandValue)

  const router = useRouter()
  const dispatch = useAppDispatch()

  const onCancel = () => {
    router.back()
  }

  const onSignOnlyPress = () => {
    dispatch(signTxCommand({ broadcast: false }))
  }

  const onSignAndBroadcastPress = () => {
    dispatch(signTxCommand({ broadcast: true }))
  }

  return (
    <HomeLayout
      header={null}
      footer={
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '48%', height: 56 }}
              color="secondary"
              onPress={onSignOnlyPress}
              disabled={Boolean(loading)}
              loading={Boolean(loading)}
            >
              Sign Only
            </Button>
            <Button
              style={{ width: '48%', height: 56 }}
              color="primary"
              onPress={onSignAndBroadcastPress}
              disabled={Boolean(loading)}
              loading={Boolean(loading)}
            >
              Sign and Broadcast
            </Button>
          </View>
          <Spacer space={12} />
          <Button color="tertiary" onPress={onCancel}>
            Cancel
          </Button>
          <Spacer space={16} />
        </View>
      }
    >
      <ScrollView>
        <Spacer space={24} />
        <Text.Body>
          Permission requested to: <Text.Body weight={Text.weights.bold}>{command?.func ?? '—'}</Text.Body>
        </Text.Body>

        <>
          <Spacer space={24} />
          <Ruller />
          <FormItem
            label="Tx Fee"
            labelStyle={{ minWidth: 100 }}
            value={loading ? <LoadingSkeleton /> : `${formatter.balance(estimated?.amount)} GNOT`}
          />
          <Ruller />
          <FormItem label="Remote" labelStyle={{ minWidth: 100 }} value={command?.remote || '—'} />
          <Ruller />
          <FormItem label="Address" labelStyle={{ minWidth: 100 }} value={command?.address || '—'} />
          <Ruller />
          <FormItem label="ChainId" labelStyle={{ minWidth: 100 }} value={command?.chainId || '—'} />
          <Ruller />
          <FormItem label="PkgPath" labelStyle={{ minWidth: 100 }} value={command?.pkgPath || '—'} />
          <Ruller />
          <FormItem label="Send" labelStyle={{ minWidth: 100 }} value={command?.send || '—'} />
          <Ruller />
          <FormItem
            label="Args"
            labelStyle={{ minWidth: 100 }}
            value={command?.args?.length ? JSON.stringify(command.args, null, 2) : '—'}
          />
          <Ruller />
          <Spacer space={24} />
          <BetaVersionMiniBanner />
          <Spacer space={24} />

          <Collapsable>
            <Ruller />
            <FormItem
              label="Raw Tx"
              labelStyle={{ minWidth: 100 }}
              copyTextValue={JSON.stringify(command, null, 2)}
              value={
                <>
                  <Text.Json>{JSON.stringify(command)}</Text.Json>
                  <Icons.CopyIcon />
                </>
              }
            />
            <Ruller />
          </Collapsable>
        </>
      </ScrollView>
      <LoadingModal visible={Boolean(loading)} message={loading || 'Loading...'} />
    </HomeLayout>
  )
}

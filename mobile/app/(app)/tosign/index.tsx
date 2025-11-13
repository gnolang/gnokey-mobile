import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import * as Linking from 'expo-linking'
import {
  estimateTxFeeAndSign,
  selectClientName,
  selectBech32Address,
  selectTxInput,
  useAppDispatch,
  useAppSelector,
  reasonSelector,
  selectCallback,
  selectKeyInfo,
  selectChainId,
  selectRemote,
  selectSignedTx,
  selectTxFee,
  selectLinkIsLoading
} from '@/redux'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FormItem } from '@berty/gnonative-ui'
import { Text, Spacer, Ruller, Button, HomeLayout } from '@berty/gnonative-ui'
import { Icons, ScreenHeader, BetaVersionMiniBanner, formatter } from '@/components'

export default function Page() {
  const dispatch = useAppDispatch()
  const { gnonative } = useGnoNativeContext()

  const clientName = useAppSelector(selectClientName)
  const reason = useAppSelector(reasonSelector)
  const bech32Address = useAppSelector(selectBech32Address)
  const txInput = useAppSelector(selectTxInput)
  const callback = useAppSelector(selectCallback)
  const keyInfo = useAppSelector(selectKeyInfo)
  const chainId = useAppSelector(selectChainId)
  const remote = useAppSelector(selectRemote)
  const signedTx = useAppSelector(selectSignedTx)
  const txFee = useAppSelector(selectTxFee)
  const isLoading = useAppSelector(selectLinkIsLoading)

  const [gnonativeReady, setGnonativeReady] = useState(false)

  // console.log('txInput', txInput)
  // console.log('bech32Address', bech32Address)
  // console.log('clientName', clientName)
  // console.log('reason', reason)
  // console.log('callback', callback)

  useEffect(() => {
    ;(async () => {
      if (!chainId || !remote || !bech32Address) {
        console.log('No chainId, remote, or bech32Address', { chainId, remote, bech32Address })
        return
      }
      await gnonative.setChainID(chainId)
      await gnonative.setRemote(remote)
      await gnonative.activateAccount(bech32Address)
      setGnonativeReady(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bech32Address])

  useEffect(() => {
    ;(async () => {
      try {
        if (!txInput || !keyInfo || !gnonativeReady) {
          console.log('No txInput, keyInfo, or gnonativeReady', gnonativeReady)
          return
        }

        // need to pause to let the Keybase DB close before using it again
        // await new Promise((f) => setTimeout(f, 2000))
        await dispatch(estimateTxFeeAndSign()).unwrap()
      } catch (error: unknown | Error) {
        console.error(error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txInput, keyInfo, gnonativeReady])

  const signTxAndReturnToRequester = async () => {
    console.log('signing the tx', keyInfo)

    if (!txInput || !keyInfo) throw new Error('No transaction input or keyInfo found.')
    if (!callback) throw new Error('No callback found.')
    if (!signedTx) throw new Error('No signed Tx found.')

    try {
      const path = new URL(callback)
      path.searchParams.append('tx', signedTx)
      path.searchParams.append('status', 'success')
      console.log('return URL ' + path.toString())
      Linking.openURL(path.toString())
      router.push('/home')
    } catch (error) {
      console.error('Error signing the tx', error)
      const path = new URL(callback)
      path.searchParams.append('status', '' + error)
      Linking.openURL(path.toString())
    }
  }

  const onCancel = async () => {
    if (callback) {
      Linking.openURL(`${callback}?status=cancelled`) // callback to requester
    }
    router.replace('/home')
  }

  return (
    <>
      <HomeLayout
        header={<ScreenHeader title="Approval Request" />}
        footer={
          <View style={{ width: '100%' }}>
            <BetaVersionMiniBanner />
            <Spacer />
            <Button color="primary" onPress={signTxAndReturnToRequester} loading={isLoading} disabled={!signedTx}>
              {signedTx ? 'Approve' : 'Loading...'}
            </Button>
            <Spacer />
            <Button color="secondary" onPress={onCancel}>
              Cancel
            </Button>
          </View>
        }
      >
        <>
          <>
            <Text.Title3 weight="400">{`${clientName} is requiring permission to ${reason}`}</Text.Title3>
            <Spacer space={24} />

            <ScrollView>
              <Ruller />
              <FormItem label="Client" labelStyle={{ minWidth: 120 }} value={clientName} />
              <Ruller />
              <FormItem
                label="Tx Fee"
                labelStyle={{ minWidth: 120 }}
                value={
                  txFee ? (
                    <Text.Body_Bold>{`${formatter.balance(txFee)} GNOT (estimated)`}</Text.Body_Bold>
                  ) : (
                    <ActivityIndicator />
                  )
                }
              />
              <Ruller />
              <FormItem label="Reason" labelStyle={{ minWidth: 120 }} copyTextValue={reason} value={reason} />
              <Ruller />
              <FormItem label="Callback" labelStyle={{ minWidth: 120 }} copyTextValue={callback} value={callback} />
              <Ruller />
              <FormItem
                label="Address"
                labelStyle={{ minWidth: 120 }}
                copyTextValue={bech32Address}
                value={
                  <>
                    <Text.Json>{bech32Address}</Text.Json>
                    <Icons.CopyIcon />
                  </>
                }
              />
              <Ruller />
              <FormItem label="Account" labelStyle={{ minWidth: 120 }} copyTextValue={keyInfo?.name} value={keyInfo?.name} />
              <Ruller />
              <FormItem label="Chain ID" labelStyle={{ minWidth: 120 }} copyTextValue={chainId} value={chainId} />
              <Ruller />
              <FormItem
                label="Remote"
                labelStyle={{ minWidth: 120 }}
                copyTextValue={remote}
                value={<Text.Json style={{ textAlign: 'left' }}>{remote}</Text.Json>}
              />
              <Ruller />
              <HiddenGroup>
                <FormItem
                  label="Raw Tx"
                  labelStyle={{ minWidth: 120 }}
                  copyTextValue={txInput}
                  value={
                    <>
                      <Text.Json>{txInput}</Text.Json>
                      <Icons.CopyIcon />
                    </>
                  }
                />
                <Ruller />
                <FormItem
                  label="Signed Tx"
                  labelStyle={{ minWidth: 120 }}
                  copyTextValue={signedTx}
                  value={
                    signedTx ? (
                      <>
                        <Text.Json>{signedTx?.toString()}</Text.Json>
                        <Icons.CopyIcon />
                      </>
                    ) : (
                      <ActivityIndicator />
                    )
                  }
                />
              </HiddenGroup>
            </ScrollView>
          </>
        </>
      </HomeLayout>
    </>
  )
}

const HiddenGroup = ({ children }: React.PropsWithChildren) => {
  const [visible, setVisible] = useState(false)

  if (!visible) {
    return (
      <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text.Body>Show more details...</Text.Body>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {children}

      <Ruller />

      <TouchableOpacity onPress={() => setVisible(false)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text.Body>Hide details</Text.Body>
      </TouchableOpacity>
    </>
  )
}

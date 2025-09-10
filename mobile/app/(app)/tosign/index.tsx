import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import * as Linking from 'expo-linking'
import {
  estimateGasWanted,
  selectClientName,
  selectBech32Address,
  selectTxInput,
  selectUpdateTx,
  signTx,
  useAppDispatch,
  useAppSelector,
  reasonSelector,
  selectCallback,
  selectKeyInfo,
  clearLinking,
  selectChainId,
  selectRemote
} from '@/redux'
import { useGnoNativeContext } from '@gnolang/gnonative'
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import {
  Button,
  FormItem,
  FormItemInline,
  HomeLayout,
  ScreenHeader,
  Spacer,
  Text,
  BetaVersionMiniBanner,
  Ruller
} from '@/modules/ui-components'

export default function Page() {
  const dispatch = useAppDispatch()
  const { gnonative } = useGnoNativeContext()

  const clientName = useAppSelector(selectClientName)
  const reason = useAppSelector(reasonSelector)
  const bech32Address = useAppSelector(selectBech32Address)
  const txInput = useAppSelector(selectTxInput)
  const updateTx = useAppSelector(selectUpdateTx) ?? false
  const callback = useAppSelector(selectCallback)
  const keyInfo = useAppSelector(selectKeyInfo)
  const chainId = useAppSelector(selectChainId)
  const remote = useAppSelector(selectRemote)

  const [loading, setLoading] = useState(false)
  const [gnonativeReady, setGnonativeReady] = useState(false)
  const [signedTx, setSignedTx] = useState<string | undefined>(undefined)
  const [gasWanted, setGasWanted] = useState<bigint>(BigInt(0))

  console.log('txInput', txInput)
  console.log('bech32Address', bech32Address)
  console.log('clientName', clientName)
  console.log('reason', reason)
  console.log('callback', callback)

  useEffect(() => {
    ;(async () => {
      if (!chainId || !remote || !bech32Address) return
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
          console.log('No txInput, keyInfo, or gnonativeReady')
          return
        }

        // need to pause to let the Keybase DB close before using it again
        await new Promise((f) => setTimeout(f, 2000))

        const { gasWanted } = await dispatch(estimateGasWanted({ keyInfo, updateTx: updateTx })).unwrap()

        // need to pause to let the Keybase DB close before using it again
        await new Promise((f) => setTimeout(f, 2000))

        const signedTx = await dispatch(signTx({ keyInfo })).unwrap()
        setSignedTx(signedTx.signedTxJson)
        setGasWanted(gasWanted)
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

    setLoading(true)

    try {
      // let sessionToReturn;
      // if (session) {
      //   // TODO: const storedSession = Look up session.key in sessionKeys.
      //   //   if storedSession.exires_at > new Date(), throw new Error('session expired')
      // }
      // else {
      //   if (sessionWanted) {
      //     sessionToReturn = await dispatch(newSessionKey({ keyInfo, validityMinutes })).unwrap() as SessionKeyInfo
      //   }
      //   // else TODO: ask again for approval (like when there are no account sessions)
      // }

      const signedTx = await dispatch(signTx({ keyInfo })).unwrap()

      const path = new URL(callback)
      path.searchParams.append('tx', signedTx.signedTxJson)
      path.searchParams.append('status', 'success')
      // sessionToReturn && path.searchParams.append('session', JSON.stringify({ key: sessionToReturn.key, expires_at: sessionToReturn.expires_at.toISOString() }));

      Linking.openURL(path.toString())

      router.push('/home')
      console.log('return URL ' + path.toString())
    } catch (error) {
      console.error('Error signing the tx', error)
      const path = new URL(callback)
      path.searchParams.append('status', '' + error)
      Linking.openURL(path.toString())
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    dispatch(clearLinking())
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
            <Button color="primary" onPress={signTxAndReturnToRequester} loading={loading}>
              Approve
            </Button>
            <Spacer />
            <Button color="secondary" onPress={onCancel} loading={loading}>
              Cancel
            </Button>
          </View>
        }
      >
        <>
          {/* <View style={{ flexDirection: 'row', paddingTop: 16 }}>
            <ButtonText onPress={onCancel}>
              <Text.ButtonLabelBlack>Cancel</Text.ButtonLabelBlack>
            </ButtonText>
          </View> */}
          <>
            <Text.Title3 weight="400">{`${clientName} is requiring permission to ${reason}`}</Text.Title3>
            <Spacer space={24} />

            <ScrollView contentContainerStyle={{}}>
              <Ruller />
              {/* <Text.BodyCenterGray>CLIENT INFORMATION</Text.BodyCenterGray> */}
              <FormItem label="Client name" value={clientName} />
              <Ruller />
              <FormItemInline
                label="Gas Wanted"
                value={gasWanted ? <Text.Body_Bold>{gasWanted?.toString()}</Text.Body_Bold> : <ActivityIndicator />}
              />
              <Ruller />
              <FormItem label="Reason" value={reason} />
              <Ruller />
              <FormItem label="Callback" value={callback} />
              <Ruller />
              <FormItem label="Address">
                <Text.LinkText weight="500" style={{ flexShrink: 1, textAlign: 'right' }}>{`${bech32Address}`}</Text.LinkText>
              </FormItem>
              <Ruller />
              <FormItem label="Account Name" value={JSON.stringify(keyInfo?.name)} />
              <Ruller />
              <FormItem label="Chain ID" value={chainId} />
              <Ruller />
              <FormItem label="Remote" value={remote} linkStyle />
              <Ruller />

              <HiddenGroup>
                <FormItem label="Raw Tx Data">
                  <Text.LinkText weight="500" style={{ flexShrink: 1 }}>
                    {txInput}
                  </Text.LinkText>
                </FormItem>
                {/* <FormItem label="Session wanted">
                <TextBodyWhite>{JSON.stringify(sessionWanted)}</TextBodyWhite>
              </FormItem>

              <Ruller />

              <FormItem label="Session">
                <TextBodyWhite>{session ? JSON.stringify(session) : 'undefined'}</TextBodyWhite>
              </FormItem>

              <Ruller />

              <FormItem label="Realms Allowed">
                <TextBodyWhite>gno.land/r/berty/social</TextBodyWhite>
              </FormItem>*/}

                <Ruller />

                <FormItem label="Raw Signed Data">
                  {signedTx ? <Text.Body_Bold>{signedTx?.toString()}</Text.Body_Bold> : <ActivityIndicator />}
                </FormItem>
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

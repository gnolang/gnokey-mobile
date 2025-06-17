import { Layout, Ruller } from '@/components'
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
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { ScrollView, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import { Button, Container, FormItem, FormItemInline, Spacer, Text } from '@/modules/ui-components'
import styled from 'styled-components/native'

export default function Page() {
  const [loading, setLoading] = useState(false)
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
  const [signedTx, setSignedTx] = useState<string | undefined>(undefined)
  const [gasWanted, setGasWanted] = useState<bigint>(BigInt(0))

  console.log('txInput', txInput)
  console.log('bech32Address', bech32Address)
  console.log('clientName', clientName)
  console.log('reason', reason)

  useEffect(() => {
    ;(async () => {
      if (!chainId || !remote || !bech32Address) return
      gnonative.setChainID(chainId)
      gnonative.setRemote(remote)
      gnonative.activateAccount(bech32Address)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bech32Address])

  useEffect(() => {
    ;(async () => {
      try {
        if (!txInput || !keyInfo) {
          throw new Error('No transaction input or keyInfo found.')
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
  }, [txInput, keyInfo])

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
      <Container>
        <SafeAreaView>
          {/* <View style={{ flexDirection: 'row', paddingTop: 16 }}>
            <ButtonText onPress={onCancel}>
              <Text.ButtonLabelBlack>Cancel</Text.ButtonLabelBlack>
            </ButtonText>
          </View> */}
          <Layout.Body>
            <Text.H3 style={{ textAlign: 'center', paddingHorizontal: 16 }}>
              <Text.H3>{clientName} </Text.H3>
              is requiring permission to
              <Text.H3> {reason}</Text.H3>
            </Text.H3>

            <ScrollView contentContainerStyle={{}}>
              <Ruller />

              <FormItem label="Client name">
                <TextBodyBlack>{clientName}</TextBodyBlack>
              </FormItem>

              <Ruller />

              <FormItemInline label="Gas Wanted">
                {gasWanted ? <TextBodyWhite>{gasWanted?.toString()}</TextBodyWhite> : <ActivityIndicator />}
              </FormItemInline>

              <Ruller />

              <HiddenGroup>
                <FormItem label="Client name">
                  <TextBodyWhite>{clientName}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Reason">
                  <TextBodyWhite>{reason}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Callback">
                  <TextBodyWhite>{callback}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Address">
                  <TextBodyWhite>{bech32Address}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Key name (local key store info)">
                  <TextBodyWhite>{JSON.stringify(keyInfo?.name)}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Remote">
                  <TextBodyWhite>{remote}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Chain ID">
                  <TextBodyWhite>{chainId}</TextBodyWhite>
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

                <FormItem label="Raw Transaction Data">
                  <TextBodyWhite>{txInput}</TextBodyWhite>
                </FormItem>

                <Ruller />

                <FormItem label="Raw Signed Data">
                  {signedTx ? <TextBodyWhite>{signedTx?.toString()}</TextBodyWhite> : <ActivityIndicator />}
                </FormItem>
              </HiddenGroup>
            </ScrollView>

            <View style={{ height: 100 }}>
              <Button color="primary" onPress={signTxAndReturnToRequester} loading={loading}>
                Approve
              </Button>
              <Spacer />
              <Button color="secondary" onPress={onCancel} loading={loading}>
                Cancel
              </Button>
            </View>
          </Layout.Body>
        </SafeAreaView>
      </Container>
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

const TextBodyWhite = styled(Text.Body)`
  color: black;
`
const TextBodyBlack = styled(Text.Body)`
  font-weight: 400;
  color: black;
`

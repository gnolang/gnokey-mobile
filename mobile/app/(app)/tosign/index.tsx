import { Layout, Ruller, TextInput } from "@/components";
import {
  selectClientName, selectBech32Address, selectTxInput, signTx, useAppDispatch,
  useAppSelector, reasonSelector, selectCallback, selectKeyInfo, clearLinking, selectChainId,
  selectRemote, selectSession, selectSessionWanted, newSessionKey, SessionKeyInfo
} from "@/redux";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { router } from "expo-router";
import { Children, useEffect, useState } from "react";
import * as Linking from 'expo-linking';
import { ScrollView, View, TouchableOpacity, TextInput as RNTextInput } from "react-native";
import { Button, ButtonText, Checkbox, FormItem, FormItemInline, Spacer, Text } from "@/modules/ui-components";
import styled from "styled-components/native";

export default function Page() {

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { gnonative } = useGnoNativeContext();
  // const [validityMinutes, setValidityMinutes] = useState<number>(10);
  const clientName = useAppSelector(selectClientName);
  // const [value, setValue] = useState(0);
  // const [remember, setRemember] = useState(false);

  const reason = useAppSelector(reasonSelector);
  const bech32Address = useAppSelector(selectBech32Address);
  const txInput = useAppSelector(selectTxInput);
  const callback = useAppSelector(selectCallback);
  const keyInfo = useAppSelector(selectKeyInfo);
  const chainId = useAppSelector(selectChainId);
  const remote = useAppSelector(selectRemote);
  const gasFee = 0.1; // TODO: get from txInput
  // const session = useAppSelector(selectSession);
  // const sessionWanted = useAppSelector(selectSessionWanted);

  console.log('txInput', txInput);
  console.log('bech32Address', bech32Address);
  console.log('clientName', clientName);
  console.log('reason', reason);
  // console.log('session', session);
  // console.log('sessionWanted', sessionWanted);

  // useEffect(() => {
  //   if (session) {
  //     // if we have a session, mwe can sign the tx and return to the requester.
  //     setTimeout(() => {
  //       signTxAndReturnToRequester()
  //     }, 300);
  //   }
  // }, [session])

  useEffect(() => {
    (async () => {

      if (!chainId || !remote) throw new Error("No chainId or remote found.");
      gnonative.setChainID(chainId);
      gnonative.setRemote(remote);

      // const accountNameStr = await gnonative.qEval("gno.land/r/sys/users", `ResolveAddress("${bech32Address}").Name()`);
    })();
  }, [bech32Address]);

  const signTxAndReturnToRequester = async () => {
    console.log('signing the tx', keyInfo);

    if (!txInput || !keyInfo) throw new Error("No transaction input or keyInfo found.");

    if (!callback) throw new Error("No callback found.");

    setLoading(true);

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

      const signedTx = await dispatch(signTx({ keyInfo })).unwrap();

      const path = new URL(callback);
      path.searchParams.append('tx', signedTx.signedTxJson);
      path.searchParams.append('status', 'success');
      // sessionToReturn && path.searchParams.append('session', JSON.stringify({ key: sessionToReturn.key, expires_at: sessionToReturn.expires_at.toISOString() }));

      Linking.openURL(path.toString());

      router.push("/home")
      console.log("return URL " + path.toString())
    } catch (error) {
      console.error("Error signing the tx", error);
      const path = new URL(callback);
      path.searchParams.append('status', '' + error);
      Linking.openURL(path.toString());
    } finally {
      setLoading(false);
    }
  }

  const onCancel = () => {
    dispatch(clearLinking());
    if (callback) {
      Linking.openURL(`${callback}?status=cancelled`); // callback to requester
    }
    router.replace("/home");
  }

  return (
    <>
      <Layout.Container>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <ButtonText onPress={onCancel}><Text.ButtonLabelBlack>Cancel</Text.ButtonLabelBlack></ButtonText>
        </View>
        <Layout.Body>

          <Text.H3 style={{ textAlign: 'center', paddingHorizontal: 16 }}>
            <Text.H3>{clientName} </Text.H3>
            is requiring permission to
            <Text.H3> {reason}.</Text.H3>
          </Text.H3>

          <Spacer space={32} />

          <ScrollView contentContainerStyle={{}}>

            <Ruller />

            <FormItem label="Client name" >
              <TextBodyBlack>{clientName}</TextBodyBlack>
            </FormItem>

            <Ruller />

            <FormItemInline label="Max Amount" >
              <TextBodyWhite>{gasFee} ugnot</TextBodyWhite>
            </FormItemInline>

            {/* {sessionWanted &&
              <>
                <FormItemInline label="Remember this permission" >
                  <Checkbox
                    label=""
                    checked={remember}
                    onPress={() => setRemember(prev => !prev)}
                  />
                </FormItemInline>


                {remember ?
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text.Body>Auto-approve for next  </Text.Body>
                    <TextInput value={validityMinutes?.toString()} onChangeText={x => setValidityMinutes(Number(x))} containerStyle={{ width: 70 }} keyboardType="number-pad" />
                    <Text.Body>  minutes</Text.Body>
                  </View>
                  : null}
              </>
            } */}

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

            </HiddenGroup>
          </ScrollView>

          <Spacer space={32} />

          <View style={{ height: 100 }}>
            <Button color="primary" onPress={signTxAndReturnToRequester} loading={loading}>Approve</Button>
            <Spacer />
          </View>

        </Layout.Body>
      </Layout.Container>
    </>
  )
}

const HiddenGroup = ({ children }: React.PropsWithChildren) => {

  const [visible, setVisible] = useState(false);

  if (!visible) {
    return <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text.Body>Show more details...</Text.Body>
    </TouchableOpacity>
  }


  return <>
    {children}

    <Ruller />

    <TouchableOpacity onPress={() => setVisible(false)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text.Body>Hide details</Text.Body>
    </TouchableOpacity>
  </>
}

const TextBodyWhite = styled(Text.Body)`
  color: white;
`
const TextBodyBlack = styled(Text.Body)`
  font-weight: 400;
  color: white;
`

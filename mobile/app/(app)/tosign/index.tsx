import { Layout } from "@/components";
import Button from "@/components/button";
import Text from "@/components/text";
import { selectClientName, selectBech32Address, selectTxInput, signTx, useAppDispatch, useAppSelector, reasonSelector, selectCallback, selectKeyInfo, clearLinking, selectChainId, selectRemote, selectSession, selectSessionWanted, newSessionKey, SessionKeyInfo } from "@/redux";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Linking from 'expo-linking';
import { View } from "react-native";
import { Spacer } from "@/modules/ui-components";

export default function Page() {

    const dispatch = useAppDispatch();
    const { gnonative } = useGnoNativeContext();
    const [accountName, setAccountName] = useState<string | undefined>(undefined);
    const clientName = useAppSelector(selectClientName);

    const reason = useAppSelector(reasonSelector);
    const bech32Address = useAppSelector(selectBech32Address);
    const txInput = useAppSelector(selectTxInput);
    const callback = useAppSelector(selectCallback);
    const keyInfo = useAppSelector(selectKeyInfo);
    const chainId = useAppSelector(selectChainId);
    const remote = useAppSelector(selectRemote);
    const session = useAppSelector(selectSession);
    const sessionWanted = useAppSelector(selectSessionWanted);

    console.log('txInput', txInput);
    console.log('bech32Address', bech32Address);
    console.log('clientName', clientName);
    console.log('reason', reason);
    console.log('session', session);
    console.log('sessionWanted', sessionWanted);

    useEffect(() => {
      if (session) {
        // if we have a session, mwe can sign the tx and return to the requester.
        setTimeout(() => {
          signTxAndReturnToRequester()
        }, 3000);
      }
    }, [session])

    useEffect(() => {
        (async () => {

            if (!chainId || !remote) throw new Error("No chainId or remote found.");
            gnonative.setChainID(chainId);
            gnonative.setRemote(remote);

            const accountNameStr = await gnonative.qEval("gno.land/r/sys/users", `ResolveAddress("${bech32Address}").Name()`);
            setAccountName(accountNameStr);
        })();
    }, [bech32Address]);

    const signTxAndReturnToRequester = async () => {
        console.log('signing the tx', keyInfo);

        if (!txInput || !keyInfo) throw new Error("No transaction input or keyInfo found.");

        if (!callback) throw new Error("No callback found.");

        try {

        let session;
        if (sessionWanted) {
          session = await dispatch(newSessionKey({ keyInfo })).unwrap() as SessionKeyInfo
        }

        const signedTx = await dispatch(signTx({ keyInfo })).unwrap();

        const path = new URL(callback);
        path.searchParams.append('tx', signedTx.signedTxJson);
        session && path.searchParams.append('session', session.key);

        Linking.openURL(path.toString());

        router.push("/home")
        console.log("return URL " + path.toString())
      } catch (error) {
        console.error("Error signing the tx", error);
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
                <Layout.BodyAlignedBotton>
                    <Text.Title>{clientName} is requiring permission to {reason}.</Text.Title>
                    <Spacer space={16} />

                    <Spacer space={16} />
                    <Text.Body>reason: {JSON.stringify(reason)}</Text.Body>
                    <Text.Body>callback: {JSON.stringify(callback)}</Text.Body>
                    <Text.Body>client_name: {JSON.stringify(clientName)}</Text.Body>
                    <Text.Body>accountName: {JSON.stringify(accountName)}</Text.Body>
                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                        <Text.Body>Address:</Text.Body>
                        <Text.Caption1>{bech32Address}</Text.Caption1>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                        <Text.Body>Keyinfo:</Text.Body>
                        <Text.Caption1>{JSON.stringify(keyInfo?.name)}</Text.Caption1>
                    </View>
                    <Text.Body>remote: {JSON.stringify(remote)}</Text.Body>
                    <Text.Body>chainId: {JSON.stringify(chainId)}</Text.Body>
                    <Text.Body>session wanted: {JSON.stringify(sessionWanted)}</Text.Body>
                    <Text.Body>session id: {JSON.stringify(session)}</Text.Body>

                    <Spacer space={16} />

                    <Button.TouchableOpacity title="Approve" variant="primary" onPress={signTxAndReturnToRequester}></Button.TouchableOpacity>
                    <Button.TouchableOpacity title="Cancel" variant="primary-red" onPress={onCancel}></Button.TouchableOpacity>
                </Layout.BodyAlignedBotton>
            </Layout.Container>
        </>
    )

}

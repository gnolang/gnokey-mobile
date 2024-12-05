import { Layout } from "@/components";
import Button from "@/components/button";
import Spacer from "@/components/spacer";
import Text from "@/components/text";
import { selectClientName, selectBech32Address, selectTxInput, signTx, useAppDispatch, useAppSelector, reasonSelector, selectCallback, selectKeyInfo, clearLinking, selectChainId, selectRemote } from "@/redux";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Linking from 'expo-linking';
import { View } from "react-native";

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

    console.log('txInput', txInput);
    console.log('bech32Address', bech32Address);
    console.log('clientName', clientName);
    console.log('reason', reason);

    useEffect(() => {
        (async () => {

            if (!chainId || !remote) throw new Error("No chainId or remote found.");
            gnonative.setChainID(chainId);
            gnonative.setRemote(remote);

            const accountNameStr = await gnonative.qEval("gno.land/r/demo/users", `GetUserByAddress("${bech32Address}").Name`);
            setAccountName(accountNameStr);
        })();
    }, [bech32Address]);

    const signTxAndReturnToRequester = async () => {
        console.log('onChangeAccountHandler', keyInfo);

        if (!txInput || !keyInfo) {
            throw new Error("No transaction input or keyInfo found.");
        }

        const signedTx = await dispatch(signTx({ keyInfo })).unwrap();

        const path = callback ? callback : 'tech.berty.dsocial://post';
        const url = `${path}?tx=${encodeURIComponent(signedTx.signedTxJson)}`;
        console.log("response URL " + url);
        Linking.openURL(url);

        router.push("/home")
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
                    <Text.Body>reason: {reason}</Text.Body>
                    <Text.Body>callback: {callback}</Text.Body>
                    <Text.Body>client_name: {clientName}</Text.Body>
                    <Text.Body>accountName: {accountName}</Text.Body>
                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                        <Text.Body>Address:</Text.Body>
                        <Text.Caption1>{bech32Address}</Text.Caption1>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                        <Text.Body>Keyinfo:</Text.Body>
                        <Text.Caption1>{keyInfo?.name}</Text.Caption1>
                    </View>
                    <Text.Body>remote: {remote}</Text.Body>
                    <Text.Body>chainId: {chainId}</Text.Body>

                    <Spacer space={16} />

                    <Button.TouchableOpacity title="Approve" variant="primary" onPress={signTxAndReturnToRequester}></Button.TouchableOpacity>
                    <Button.TouchableOpacity title="Cancel" variant="primary-red" onPress={onCancel}></Button.TouchableOpacity>
                </Layout.BodyAlignedBotton>
            </Layout.Container>
        </>
    )

}
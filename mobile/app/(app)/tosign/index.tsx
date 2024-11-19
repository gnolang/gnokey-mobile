import { Layout } from "@/components";
import Button from "@/components/button";
import Spacer from "@/components/spacer";
import Text from "@/components/text";
import { selectClientName, selectBech32Address, selectTxInput, signTx, useAppDispatch, useAppSelector, reasonSelector, selectCallback, selectKeyInfo, clearLinking } from "@/redux";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Linking from 'expo-linking';

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

    console.log('txInput', txInput);
    console.log('bech32Address', bech32Address);
    console.log('clientName', clientName);
    console.log('reason', reason);

    useEffect(() => {
        (async () => {
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
        // callback to requester
        Linking.openURL(`${callback}?status=cancelled`);
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
                    <Text.Body>Address: <Text.Caption1>{bech32Address}</Text.Caption1></Text.Body>
                    <Text.Body>Keyinfo: <Text.Caption1>{keyInfo?.name}</Text.Caption1></Text.Body>

                    <Spacer space={16} />

                    <Button.TouchableOpacity title="Approve" variant="primary" onPress={signTxAndReturnToRequester}></Button.TouchableOpacity>
                    <Button.TouchableOpacity title="Cancel" variant="primary-red" onPress={onCancel}></Button.TouchableOpacity>
                </Layout.BodyAlignedBotton>
            </Layout.Container>
        </>
    )

}
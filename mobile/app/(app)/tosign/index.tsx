import { Layout } from "@/components";
import Button from "@/components/button";
import VaultListItem from "@/components/list/vault-list/VaultListItem";
import Spacer from "@/components/spacer";
import Text from "@/components/text";
import { selectClientName, selectBech32Address, selectTxInput, signTx, useAppDispatch, useAppSelector, reasonSelector } from "@/redux";
import { KeyInfo, useGnoNativeContext } from "@gnolang/gnonative";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import * as Linking from 'expo-linking';

export default function Page() {
    const [loading, setLoading] = useState<string | undefined>(undefined);
    const [accounts, setAccounts] = useState<KeyInfo[]>([]);

    const dispatch = useAppDispatch();
    const { gnonative } = useGnoNativeContext();
    const navigation = useNavigation();
    const txInput = useAppSelector(selectTxInput);
    const bech32Address = useAppSelector(selectBech32Address);
    const [accountName, setAccountName] = useState<string | undefined>(undefined);
    const clientName = useAppSelector(selectClientName);
    const reason = useAppSelector(reasonSelector);

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


    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            try {
                setLoading("Loading accounts...");

                const response = await gnonative.listKeyInfo();
                setAccounts(response);
            } catch (error: unknown | Error) {
                console.error(error);
            } finally {
                setLoading(undefined);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const signTxAndReturnToRequester = async (keyInfo: KeyInfo) => {
        console.log('onChangeAccountHandler', keyInfo);

        if (!txInput) {
            throw new Error("No transaction input found.");
        }

        const signedTx = await dispatch(signTx({ keyInfo })).unwrap();

        Linking.openURL('tech.berty.dsocial://post?tx=' + encodeURIComponent(signedTx.signedTxJson));

        router.push("/home")
    }

    return (
        <>
            <Layout.Container>
                <Layout.BodyAlignedBotton>
                    <Text.Title>{clientName} is requiring permission to {reason}.</Text.Title>
                    <Spacer space={16} />
                    <Text.Body>In the next version of this app you'll get more details about the transaction dSocial is trying to execute.</Text.Body>

                    <Spacer space={16} />
                    <Text.Title>For now, please select a key {accountName} to sign the transaction</Text.Title>
                    <Spacer space={16} />

                    {accounts && (
                        <FlatList
                            data={accounts}
                            renderItem={({ item }) => (
                                <VaultListItem vault={item} onVaultPress={signTxAndReturnToRequester} />
                            )}
                            keyExtractor={(item) => item.name}
                            ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
                        />
                    )}
                    <Button.TouchableOpacity title="Cancel" variant="primary" onPress={() => router.push("/home")}></Button.TouchableOpacity>
                </Layout.BodyAlignedBotton>
            </Layout.Container>
        </>
    )

}
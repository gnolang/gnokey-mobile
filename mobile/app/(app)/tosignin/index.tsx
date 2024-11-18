import { Layout } from "@/components";
import Button from "@/components/button";
import VaultListItem from "@/components/list/vault-list/VaultListItem";
import Spacer from "@/components/spacer";
import Text from "@/components/text";
import { clearLinking, selectCallback, sendAddressToSoliciting, useAppDispatch, useAppSelector } from "@/redux";
import { KeyInfo, useGnoNativeContext } from "@gnolang/gnonative";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import * as Linking from 'expo-linking';

export default function Page() {
    const [loading, setLoading] = useState<string | undefined>(undefined);
    const [accounts, setAccounts] = useState<KeyInfo[]>([]);

    const { gnonative } = useGnoNativeContext();
    const navigation = useNavigation();

    const callback = useAppSelector(selectCallback);
    const dispatch = useAppDispatch();

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

    const returnKeyAddressToSoliciting = useCallback(async (keyInfo: KeyInfo) => {
        await dispatch(sendAddressToSoliciting({ keyInfo })).unwrap();

        router.push("/home")
    }, [callback]);

    const onCancel = () => {
        dispatch(clearLinking())
        Linking.openURL(`${callback}?status=cancelled`);
    }

    return (
        <>
            <Layout.Container>
                <Layout.BodyAlignedBotton>
                    <Text.Title>Select a key to sign in into dSocial</Text.Title>
                    <Spacer space={16} />

                    {accounts && (
                        <FlatList
                            data={accounts}
                            renderItem={({ item }) => (
                                <VaultListItem vault={item} onVaultPress={returnKeyAddressToSoliciting} />
                            )}
                            keyExtractor={(item) => item.name}
                            ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
                        />
                    )}
                    <Button.TouchableOpacity title="Cancel" variant="primary" onPress={onCancel}></Button.TouchableOpacity>
                </Layout.BodyAlignedBotton>
            </Layout.Container>
        </>
    )

}
import { Layout } from "@/components";
import Button from "@/components/button";
import VaultListItem from "@/components/list/vault-list/VaultListItem";
import Text from "@/components/text";
import { clearLinking, Vault, selectCallback, selectClientName, selectVaults, sendAddressToSoliciting, useAppDispatch, useAppSelector, fetchVaults, checkForKeyOnChains, selectVaultsChains } from "@/redux";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import * as Linking from 'expo-linking';
import { Spacer } from "@/modules/ui-components";

export default function Page() {
    const [loading, setLoading] = useState<string | undefined>(undefined);

    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const vaults = useAppSelector(selectVaults)
    const callback = useAppSelector(selectCallback);
    const clientName = useAppSelector(selectClientName)
    const vaultsChains = useAppSelector(selectVaultsChains)

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            try {
              setLoading("Loading accounts...");

              if (!vaults || vaults.length === 0) {
              await dispatch(fetchVaults()).unwrap();
              dispatch(checkForKeyOnChains()).unwrap();
              }

            } catch (error: unknown | Error) {
                console.error(error);
            } finally {
                setLoading(undefined);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const returnKeyAddressToSoliciting = useCallback(async (keyInfo: Vault) => {
        await dispatch(sendAddressToSoliciting({ keyInfo: keyInfo.keyInfo })).unwrap();

        router.push("/home")
    }, [callback]);

    const onCancel = () => {
        dispatch(clearLinking())
        Linking.openURL(`${callback}?status=cancelled`);
        router.replace("/home")
    }

    return (
        <>
            <Layout.Container>
                <Layout.BodyAlignedBotton>
                    <Text.Title>Select a key to sign in into {clientName}</Text.Title>
                    <Spacer space={16} />

                    {vaults && (
                        <FlatList
                            data={vaults}
                            renderItem={({ item }) => (
                              <VaultListItem vault={item}
                                onVaultPress={returnKeyAddressToSoliciting}
                                chains={item.chains} />
                            )}
                            keyExtractor={(item) => item.keyInfo.name}
                            ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
                        />
                    )}
                    <Button.TouchableOpacity title="Cancel" variant="primary" onPress={onCancel}></Button.TouchableOpacity>
                </Layout.BodyAlignedBotton>
            </Layout.Container>
        </>
    )

}

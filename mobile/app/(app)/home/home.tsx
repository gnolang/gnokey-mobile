import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Layout } from "@/components/index";
import Text from "@/components/text";
import { checkForKeyOnChains, selectMasterPassword, useAppDispatch, useAppSelector, selectKeyInfoChains } from "@/redux";
import { KeyInfo, useGnoNativeContext } from "@gnolang/gnonative";
import VaultListItem from "@/components/list/vault-list/VaultListItem";
import { setVaultToEdit } from "@/redux";
import { AppBar, ButtonIcon, Button, TextField, Spacer } from "@/modules/ui-components";
import { FontAwesome6 } from "@expo/vector-icons";
import styled from "styled-components/native";

export default function Page() {
  const route = useRouter();

  const [nameSearch, setNameSearch] = useState<string>("");
  const [accounts, setAccounts] = useState<KeyInfo[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<KeyInfo[]>([]);
  const [loading, setLoading] = useState<string | undefined>(undefined);

  const { gnonative } = useGnoNativeContext();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const masterPassword = useAppSelector(selectMasterPassword)

  const keyInfoChains = useAppSelector(selectKeyInfoChains)

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        setLoading("Loading accounts...");

        const response = await gnonative.listKeyInfo();
        setAccounts(response);
        dispatch(checkForKeyOnChains())
      } catch (error: unknown | Error) {
        console.error(error);
      } finally {
        setLoading(undefined);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (nameSearch) {
      setFilteredAccounts(accounts.filter((account) => account.name.includes(nameSearch)));
    } else {
      setFilteredAccounts(accounts);
    }
  }, [nameSearch, accounts]);

  const onChangeAccountHandler = async (keyInfo: KeyInfo) => {
    try {
      setLoading("Changing account...");

      if (!masterPassword) {
        throw new Error("No master password defined. Please create one.");
      }

      await gnonative.activateAccount(keyInfo.name);
      await gnonative.setPassword(masterPassword, keyInfo.address);

      setLoading(undefined);

      await dispatch(setVaultToEdit({ vault: keyInfo }));
      route.push("/vault/details");

    } catch (error: unknown | Error) {
      setLoading(error?.toString());
      console.log(error);
    }
  };

  const navigateToAddKey = () => {
    route.push("/add-key");
  }

  const getChainNamePerKey = (keyInfo: KeyInfo): string[] | undefined => {
    if (keyInfoChains instanceof Map && keyInfoChains?.has(keyInfo.address.toString())) {
      return keyInfoChains.get(keyInfo.address.toString())
    }
  }

  if (loading) {
    return (
      <Layout.Container>
        <Layout.Body>
          <Text.Title>{loading}</Text.Title>
        </Layout.Body>
      </Layout.Container>
    );
  }

  return (
    <>
      <Layout.Container>
        <AppBar>
          <ButtonIcon onPress={() => route.push('/home/profile')} size={40} color='tertirary'>
            <FontAwesome6 name='user' size={20} color='black' />
          </ButtonIcon>

          <Button onPress={navigateToAddKey} color='tertirary' endIcon={<FontAwesome6 name='add' size={16} color='black' />}>
            New Vault
          </Button>
        </AppBar>
        <BodyAlignedBotton>
          <TextField placeholder='Search Vault' value={nameSearch} onChangeText={setNameSearch} autoCapitalize="none" autoCorrect={false} />

          <Spacer />
          <Text.Body style={{ textAlign: 'center' }} >{filteredAccounts.length} {filteredAccounts.length > 1 ? 'results' : 'result'}</Text.Body>
          <Spacer />

          {filteredAccounts && (
            <FlatList
              data={filteredAccounts}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => (
                <VaultListItem vault={item} onVaultPress={onChangeAccountHandler} chains={getChainNamePerKey(item)} />
              )}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
            />
          )}
        </BodyAlignedBotton>
      </Layout.Container>
    </>
  );
}

export const BodyAlignedBotton = styled.View`
  width: 100%;
  height: 100%;
  padding-top: 4px;
  justify-content: flex-end;
  padding-bottom: 12px;
`;

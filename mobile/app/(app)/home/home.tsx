import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Layout } from "@/components/index";
import { checkForKeyOnChains, selectMasterPassword, useAppDispatch, useAppSelector, selectKeyInfoChains, selectVaults, setBookmark, KeyInfoBookmark } from "@/redux";
import { useGnoNativeContext } from "@gnolang/gnonative";
import VaultListItem from "@/components/list/vault-list/VaultListItem";
import { setVaultToEdit, fetchVaults } from "@/redux";
import { AppBar, ButtonIcon, Button, TextField, Spacer, Text } from "@/modules/ui-components";
import { FontAwesome6 } from "@expo/vector-icons";
import styled from "styled-components/native";
import { ModalConfirm } from "@/components/modal/ModalConfirm";

export default function Page() {
  const route = useRouter();

  const [nameSearch, setNameSearch] = useState<string>("");
  const [filteredAccounts, setFilteredAccounts] = useState<KeyInfoBookmark[]>([]);
  const [loading, setLoading] = useState<string | undefined>(undefined);

  const { gnonative } = useGnoNativeContext();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const masterPassword = useAppSelector(selectMasterPassword)

  const keyInfoChains = useAppSelector(selectKeyInfoChains)

  const vaults = useAppSelector(selectVaults)

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        setLoading("Loading accounts...");

        await dispatch(fetchVaults()).unwrap();

        await dispatch(checkForKeyOnChains()).unwrap();
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
      setFilteredAccounts(vaults ? vaults.filter((account) => account.keyInfo.name.includes(nameSearch)) : []);
    } else {
      setFilteredAccounts(vaults || []);
    }
  }, [nameSearch, vaults]);

  const onChangeAccountHandler = async (keyInfo: KeyInfoBookmark) => {
    try {
      setLoading("Changing account...");

      if (!masterPassword) {
        throw new Error("No master password defined. Please create one.");
      }

      await gnonative.activateAccount(keyInfo.keyInfo.name);
      await gnonative.setPassword(masterPassword, keyInfo.keyInfo.address);

      setLoading(undefined);

      await dispatch(setVaultToEdit({ vault: keyInfo }));
      route.push("/vault/details");

    } catch (error: unknown | Error) {
      setLoading(error?.toString());
      console.log(error);
    }
  };

  const navigateToAddKey = () => {
    route.push("/home/add-key");
  }

  const getChainNamePerKey = (keyInfo: KeyInfoBookmark): string[] | undefined => {
    if (keyInfoChains instanceof Map && keyInfoChains?.has(keyInfo.keyInfo.address.toString())) {
      return keyInfoChains.get(keyInfo.keyInfo.address.toString())
    }
  }

  const onBookmarkPress = (keyInfo: KeyInfoBookmark) => async () => {
    console.log('Bookmark pressed', keyInfo.keyInfo.address)
    dispatch(setBookmark({ keyAddress: keyInfo.keyInfo.address, value: !keyInfo.bookmarked }))
  }

  if (loading) {
    return (
      <Layout.Container>
        <Layout.Body>
          <Text.Body>{loading}</Text.Body>
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
          <Text.H1>Your Safe</Text.H1>
          <View style={{ flexDirection: 'row' }}>
            <Text.H1 style={{ color: 'white' }}>Vault List</Text.H1>
          </View>

          <TextField placeholder='Search Vault' value={nameSearch} onChangeText={setNameSearch} autoCapitalize="none" autoCorrect={false} />

          <Spacer />
          <Text.Body style={{ textAlign: 'center' }} >{filteredAccounts.length} {filteredAccounts.length > 1 ? 'results' : 'result'}</Text.Body>
          <Spacer />

          {filteredAccounts && (
            <FlatList
              data={filteredAccounts}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => (
                <VaultListItem vault={item}
                  onVaultPress={onChangeAccountHandler}
                  chains={getChainNamePerKey(item)}
                  onBookmarkPress={onBookmarkPress(item)} />
              )}
              keyExtractor={(item) => item.keyInfo.name}
              ListEmptyComponent={<ShowModal onConfirm={navigateToAddKey} />}
            />
          )}
        </BodyAlignedBotton>
      </Layout.Container>
    </>
  );
}

const ShowModal = ({ onConfirm }: { onConfirm: () => void }) => {
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(true);
  return (
    <ModalConfirm visible={visible}
      onCancel={() => setVisible(false)}
      onConfirm={() => { onConfirm() }}
      title="Not Found"
      confirmText="Add Vault"
      message="Your Vault doesn't exist. Do you want to create a new one?" />)
}


export const BodyAlignedBotton = styled.View`
  width: 100%;
  height: 100%;
  padding-top: 4px;
  padding-horizontal: 8px;
  justify-content: flex-end;
  padding-bottom: 12px;
`;

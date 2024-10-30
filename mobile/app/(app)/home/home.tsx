import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Layout } from "@/components/index";
import Text from "@/components/text";
import { selectMasterPassword, useAppDispatch, useAppSelector } from "@/redux";
import { KeyInfo, useGnoNativeContext } from "@gnolang/gnonative";
import Octicons from '@expo/vector-icons/Octicons';
import TextInput from "@/components/textinput";
import { colors } from "@/assets/styles/colors";
import VaultListItem from "@/components/list/vault-list/VaultListItem";
import { setVaultToEdit } from "@/redux/features/vaultEditSlice";

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
        <Layout.BodyAlignedBotton>
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginHorizontal: 8 }}>
            <TextInput placeholder="Search Vault" containerStyle={{ width: '86%' }} value={nameSearch} onChangeText={setNameSearch}>
              <Octicons name="search" size={24} color="gray" />
            </TextInput>
            <TouchableOpacity onPress={() => route.push("/add-key")}>
              <Octicons name="diff-added" size={38} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {filteredAccounts && (
            <FlatList
              data={filteredAccounts}
              renderItem={({ item }) => (
                <VaultListItem vault={item} onVaultPress={onChangeAccountHandler} />
              )}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={<Text.Body>There are no items to list.</Text.Body>}
            />
          )}
          {/* </ScrollView> */}
        </Layout.BodyAlignedBotton>
      </Layout.Container>
    </>
  );
}

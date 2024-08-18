import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import Button from "@/components/button";
import { Layout } from "@/components/index";
import SideMenuAccountList from "@/components/list/account/account-list";
import Text from "@/components/text";
import { loggedIn, selectMasterPassword, useAppDispatch, useAppSelector } from "@/redux";
import { KeyInfo } from "@buf/gnolang_gnonative.bufbuild_es/gnonativetypes_pb";
import { useGnoNativeContext } from "@gnolang/gnonative";
import Spacer from "@/components/spacer";

export default function Page() {
  const route = useRouter();

  const [accounts, setAccounts] = useState<KeyInfo[]>([]);
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

  const onChangeAccountHandler = async (keyInfo: KeyInfo) => {
    try {
      setLoading("Changing account...");

      if (!masterPassword) {
        throw new Error("No master password defined. Please create one.");
      }

      await gnonative.selectAccount(keyInfo.name);
      await gnonative.setPassword(masterPassword);

      setLoading(undefined);

      await dispatch(loggedIn({ keyInfo }));
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
          <View style={{ alignItems: "center" }}>
            <Button.TouchableOpacity title="Add Gno Key" onPress={() => route.push("/add-key")} variant="primary" />
          </View>

          <ScrollView style={{ marginTop: 24 }}>
            {accounts && accounts.length > 0 && (
              <>
                <Text.Body>Registered keys:</Text.Body>
                <SideMenuAccountList accounts={accounts} changeAccount={onChangeAccountHandler} />
                <Spacer />
              </>
            )}
          </ScrollView>
        </Layout.BodyAlignedBotton>
      </Layout.Container>
    </>
  );
}

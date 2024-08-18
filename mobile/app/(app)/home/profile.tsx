import { Alert, StyleSheet, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { signOut, useAppDispatch } from "@/redux";
import Button from "@/components/button";
import { KeyInfo } from "@buf/gnolang_gnonative.bufbuild_es/gnonativetypes_pb";
import { Layout } from "@/components/index";
import { LoadingModal } from "@/components/loading";
import { AccountBalance } from "@/components/settings";
import Text from "@/components/text";
import { onboarding } from "redux/features/signupSlice";

export default function Page() {
  const [activeAccount, setActiveAccount] = useState<KeyInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [chainID, setChainID] = useState("");
  const [remote, setRemote] = useState("");

  const { gnonative } = useGnoNativeContext();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        fetchAccountData();
      } catch (error: unknown | Error) {
        console.log(error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const onboard = async () => {
    if (!activeAccount) {
      console.log("No active account");
      return;
    }
    setLoading(true);
    try {
      await dispatch(onboarding({ account: activeAccount })).unwrap();
      fetchAccountData();
    } catch (error) {
      console.log("Error on onboard", JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountData = async () => {
    const account = await gnonative.getActiveAccount();
    const chainId = await gnonative.getChainID();
    const remote = await gnonative.getRemote();
    setActiveAccount(account.key);
    setChainID(chainId);
    setRemote(remote);
  };

  const onRemoveAccount = async () => {
    router.navigate({ pathname: "account/remove" });
  };

  const onPressLogout = async () => {
    dispatch(signOut());
  };

  return (
    <>
      <Layout.Container>
        <Layout.Body>
          <>
            {/* Revisit active account feature */}
            {/* <AccountBalance activeAccount={activeAccount} /> */}
            <Text.Subheadline>Chain ID:</Text.Subheadline>
            <Text.Body>{chainID}</Text.Body>
            <Text.Subheadline>Remote:</Text.Subheadline>
            <Text.Body>{remote}</Text.Body>
            <View></View>
          </>
          <Layout.Footer>
            {/* TODO: Revisit this feature */}
            {/* <Button.TouchableOpacity title="Onboard the current user" onPress={onboard} variant="primary" /> */}
            <Button.TouchableOpacity title="Logout" onPress={onPressLogout} style={styles.logout} variant="primary-red" />
            {/* TODO: Implement remove key */}
            {/* <Button.TouchableOpacity
              title="Remove Key on another page"
              onPress={onRemoveAccount}
              style={styles.logout}
              variant="primary-red"
            /> */}
          </Layout.Footer>
        </Layout.Body>
      </Layout.Container>
      <LoadingModal visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  logout: {
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

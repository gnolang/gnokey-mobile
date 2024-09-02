import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { signOut, useAppDispatch } from "@/redux";
import Button from "@/components/button";
import { Layout } from "@/components/index";
import { LoadingModal } from "@/components/loading";
import Text from "@/components/text";
import ChangeMasterPassword from "@/views/change-master-password";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [chainID, setChainID] = useState("");
  const [remote, setRemote] = useState("");
  const [showChangePassModal, setShowChangePassModal] = useState(false);

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

  const fetchAccountData = async () => {
    const chainId = await gnonative.getChainID();
    const remote = await gnonative.getRemote();
    setChainID(chainId);
    setRemote(remote);
  };

  const onPressChangePass = async () => {
    setShowChangePassModal(true);
  }

  const onPressLogout = async () => {
    dispatch(signOut());
  };

  return (
    <>
      <Layout.Container>
        <Layout.Body>
          <>
            <Text.Subheadline>Chain ID:</Text.Subheadline>
            <Text.Body>{chainID}</Text.Body>
            <Text.Subheadline>Remote:</Text.Subheadline>
            <Text.Body>{remote}</Text.Body>
            <View></View>
          </>
          <Layout.Footer>
            <Button.TouchableOpacity title="Change master password" onPress={onPressChangePass} style={styles.logout} variant="primary-red" />
            <Button.TouchableOpacity title="Logout" onPress={onPressLogout} style={styles.logout} variant="primary-red" />
          </Layout.Footer>
        </Layout.Body>
      </Layout.Container>
      <LoadingModal visible={loading} />
      <ChangeMasterPassword visible={showChangePassModal} onClose={setShowChangePassModal} />
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

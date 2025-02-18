import { View } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { signOut, useAppDispatch } from "@/redux";
import { Layout } from "@/components/index";
import { LoadingModal } from "@/components/loading";
import Text from "@/components/text";
import ChangeMasterPassword from "@/views/change-master-password";
import { AppBar, Button, Container, SafeAreaView, Spacer } from "@/modules/ui-components";
import { FontAwesome6 } from "@expo/vector-icons";
import FormItem from "@/components/form/form-item";

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
      <SafeAreaView style={{ flex: 1 }}>
        <AppBar>
          <View />
          <Button onPress={() => navigation.goBack()} color='tertirary' endIcon={<FontAwesome6 name='xmark' size={16} color='black' />}>
            Cancel
          </Button>
        </AppBar>

        <Container style={{ flex: 1 }}>

          <FormItem label="Chain ID">
            <Text.Body>{chainID}</Text.Body>
          </FormItem>

          <FormItem label="Remote">
            <Text.Body>{remote}</Text.Body>
          </FormItem>

          <Layout.Footer>
            <Button onPress={onPressChangePass} color="danger">Change master password</Button>
            <Spacer />
            <Button onPress={onPressLogout} color="danger">Logout</Button>
          </Layout.Footer>

        </Container>

        <LoadingModal visible={loading} />
      </SafeAreaView>
      <ChangeMasterPassword visible={showChangePassModal} onClose={() => setShowChangePassModal(false)} />
    </>
  );
}

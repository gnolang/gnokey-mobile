import { StyleSheet, Text, View, ScrollView, TextInput as RNTextInput, Alert as RNAlert, Modal } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import { useGnoNativeContext } from "@gnolang/gnonative";
import {
  selectMasterPassword, useAppDispatch, useAppSelector,
  SignUpState,
  initSignUpState,
  existingAccountSelector,
  newAccountSelector,
  onboarding,
  signUp,
  signUpStateSelector,
  selectKeyName,
  setKeyName,
  selectPhrase,
  selectSelectedChain,
} from "@/redux";
import { ProgressViewModal, ChainSelectView } from "@/views";
import { TextCopy, Layout, Alert, Spacer, Button, TextInput, ModalHeader, ModalContent } from "@/components";
import { Octicons } from "@expo/vector-icons";
import { colors } from "@/assets";
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function Page() {

  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const inputRef = useRef<RNTextInput>(null);

  const navigation = useNavigation();
  const { gnonative } = useGnoNativeContext();

  const dispatch = useAppDispatch();

  const masterPassword = useAppSelector(selectMasterPassword);
  const signUpState = useAppSelector(signUpStateSelector);
  const newAccount = useAppSelector(newAccountSelector);
  const existingAccount = useAppSelector(existingAccountSelector);
  const keyName = useAppSelector(selectKeyName);
  const phrase = useAppSelector(selectPhrase);
  const currentNetwork = useAppSelector(selectSelectedChain)


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setError(undefined);
      inputRef.current?.focus();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      // console.log("signUpState ->", signUpState);

      if (signUpState === SignUpState.user_exists_on_blockchain_and_local_storage) {
        setError(
          "This name is already registered on the blockchain and on this device. Please choose another name."
        );
        return;
      }
      if (signUpState === SignUpState.user_already_exists_on_blockchain) {
        setError("This name is already registered on the blockchain. Please, choose another name.");
        return;
      }
      if (signUpState === SignUpState.user_already_exists_on_blockchain_under_different_name) {
        setError(
          "This account is already registered on the blockchain under a different name. Please press Back and sign up again with another Seed Phrase, or for a normal sign in with a different account if available."
        );
        return;
      }
      if (signUpState === SignUpState.user_exists_only_on_local_storage) {
        setError(
          "This name is already registered locally on this device but NOT on chain. If you want to register your account on the Gno Blockchain, please press Create again. Your seed phrase will be the same."
        );
        return;
      }
      if (signUpState === SignUpState.user_exists_under_differente_key) {
        setError(
          "This name is already registered locally and on the blockchain under a different key. Please choose another name."
        );
        return;
      }
      if (signUpState === SignUpState.user_exists_under_differente_key_local) {
        setError(
          "This name is already registered locally under a different key. Please choose another name."
        );
        return;
      }
      if (signUpState === SignUpState.account_created && newAccount) {
        onBack()
      }
    })();
  }, [signUpState, newAccount]);

  const onCreate = async (catpchaToken: string | undefined = undefined) => {
    setError(undefined);
    if (!keyName) {
      setError("Please fill out all fields");
      return;
    }

    if (!phrase) {
      setError("Phrase not found.");
      return
    }

    // Use the same regex and error message as r/demo/users
    if (!keyName.match(/^[a-z]+[_a-z0-9]{5,16}$/)) {
      setError("Account name must be at least 6 characters, lowercase alphanumeric with underscore");
      return;
    }

    if (!masterPassword) {
      setError("Master password not found.");
      return;
    }

    if (currentNetwork?.hasCaptcha && !catpchaToken) {
      setModalVisible(true);
      return
    }

    if (signUpState === SignUpState.user_exists_only_on_local_storage && existingAccount) {
      await gnonative.activateAccount(keyName);
      await gnonative.setPassword(masterPassword, existingAccount.address);
      await dispatch(onboarding({ account: existingAccount, captcha: catpchaToken })).unwrap();
      return;
    }

    try {
      setLoading(true);
      await dispatch(signUp({ name: keyName, password: masterPassword, phrase, captcha: catpchaToken })).unwrap();
    } catch (error) {
      RNAlert.alert("Error", "" + error);
      setError("" + error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    console.log("onBack");
    dispatch(initSignUpState());
    router.back()
  }

  const handleMessage = (event: WebViewMessageEvent) => {
    // Capture the token from the WebView
    const { data } = event.nativeEvent;
    console.log('Recaptcha token received:', data);
    setModalVisible(false); // Update the token in state
    onCreate(data); // Call the onCreate function with the token
  };

  return (
    <Layout.Container>
      <Layout.Body>
        <ScrollView>
          <View style={styles.main}>
            <Text style={styles.title}>Create a new Key</Text>
            <View style={{ minWidth: 200, paddingTop: 8 }}>
              <Spacer />
              <TextInput
                ref={inputRef}
                placeholder="Key name"
                value={keyName}
                onChangeText={x => dispatch(setKeyName(x))}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Spacer />
            <View style={{ minWidth: 200, paddingTop: 8, paddingBottom: 8 }}>
              <TextCopy text={phrase}>
                <Text style={{ flexDirection: "row" }}>
                  <Octicons name="copy" size={12} color={colors.primary} />
                  <Text > Your seed phrase: </Text>
                  <Text style={{ fontWeight: 700 }}>{phrase}</Text>
                </Text>
              </TextCopy>
              <Spacer />
              <ChainSelectView />
              <Alert severity="error" message={error} />
              <Spacer />
              <Button.TouchableOpacity title="Create" onPress={() => onCreate()} variant="primary" loading={loading} />
              <Spacer space={8} />
              <Button.TouchableOpacity title="Back" onPress={onBack} variant="secondary" disabled={loading} />
              <Modal visible={modalVisible} style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black'
              }}>
                <View style={{ flex: 1, height: '100%', paddingTop: 100 }}>
                  <ModalHeader title="Recaptcha" onClose={() => setModalVisible(false)} />
                  <WebView source={{ uri: 'https://fantastic-barnacle-jvxv645773j7vj-5173.app.github.dev/?chain_id=dev' }} style={{ minHeight: 500 }}
                    javaScriptEnabled
                    domStorageEnabled
                    automaticallyAdjustContentInsets
                    onMessage={handleMessage} // Handle messages from WebView
                  />
                </View>
              </Modal>
            </View>
          </View>
        </ScrollView>
        <ProgressViewModal />
      </Layout.Body >
    </Layout.Container >
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#0008",
  },
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
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

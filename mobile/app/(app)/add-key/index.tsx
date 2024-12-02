import { StyleSheet, Text, View, Button as RNButton, ScrollView, TextInput as RNTextInput, Alert as RNAlert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import TextInput from "components/textinput";
import Button from "components/button";
import Spacer from "components/spacer";
import * as Clipboard from "expo-clipboard";
import Alert from "@/components/alert";
import { Layout } from "@/components/index";
import { useGnoNativeContext } from "@gnolang/gnonative";
import {
  selectMasterPassword, useAppDispatch, useAppSelector,
  SignUpState,
  clearSignUpState,
  existingAccountSelector,
  newAccountSelector,
  onboarding,
  selectChainsAvailable,
  signUp,
  signUpStateSelector,
  selectKeyName,
  setKeyName
} from "@/redux";
import { ProgressViewModal, ChainSelectView } from "@/views";

export default function Page() {

  const [phrase, setPhrase] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [currentRemote, setCurrentRemote] = useState<string | undefined>(undefined);

  const inputRef = useRef<RNTextInput>(null);

  const masterPassword = useAppSelector(selectMasterPassword);

  const navigation = useNavigation();
  const { gnonative } = useGnoNativeContext();

  const dispatch = useAppDispatch();

  const signUpState = useAppSelector(signUpStateSelector);
  const newAccount = useAppSelector(newAccountSelector);
  const existingAccount = useAppSelector(existingAccountSelector);
  const chains = useAppSelector(selectChainsAvailable)
  const keyName = useAppSelector(selectKeyName);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setError(undefined);
      dispatch(clearSignUpState())
      inputRef.current?.focus();
      try {
        setCurrentRemote(await gnonative.getRemote());
        setPhrase(await gnonative.generateRecoveryPhrase());
      } catch (error) {
        console.log(error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      console.log("signUpState ->", signUpState);

      if (signUpState === SignUpState.user_exists_on_blockchain_and_local_storage) {
        setError(
          "This name is already registered on the blockchain and on this device. Please choose another name or press Back for a normal sign in."
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
        router.push("/home");
      }
    })();
  }, [signUpState, newAccount]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(phrase || "");
  };

  const onCreate = async () => {
    dispatch(clearSignUpState());
    setError(undefined);
    if (!keyName) {
      setError("Please fill out all fields");
      return;
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

    if (signUpState === SignUpState.user_exists_only_on_local_storage && existingAccount) {
      await gnonative.activateAccount(keyName);
      await gnonative.setPassword(masterPassword, existingAccount.address);
      await dispatch(onboarding({ account: existingAccount })).unwrap();
      return;
    }

    try {
      setLoading(true);
      await dispatch(signUp({ name: keyName, password: masterPassword, phrase })).unwrap();
    } catch (error) {
      RNAlert.alert("Error", "" + error);
      setError("" + error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    router.back()
    dispatch(clearSignUpState());
  }

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
            <View style={{ minWidth: 200, paddingTop: 8 }}>
              <Text>Your seed phrase:</Text>
              <Spacer />
              <Text>{phrase}</Text>
              <RNButton title="copy" onPress={copyToClipboard} />
              <Spacer />
              <ChainSelectView chains={chains} currentRemote={currentRemote} />
              <Alert severity="error" message={error} />
              <Spacer />
              <Button.TouchableOpacity title="Create" onPress={onCreate} variant="primary" loading={loading} />
              <Spacer space={16} />
              <Button.TouchableOpacity title="Back" onPress={onBack} variant="secondary" disabled={loading} />
            </View>
          </View>
        </ScrollView>
        <ProgressViewModal />
      </Layout.Body>
    </Layout.Container>
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
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

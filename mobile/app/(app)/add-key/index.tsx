import { StyleSheet, View, ScrollView, TextInput as RNTextInput, Alert as RNAlert } from "react-native";
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
} from "@/redux";
import { ProgressViewModal, ChainSelectView, } from "@/views";
import { TextCopy, Layout, Alert, Spacer, TextInput } from "@/components";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { colors } from "@/assets";
import { AppBar, Button, Select, Text, TextField, MenuItem } from "@/modules/ui-components";

export default function Page() {

  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

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

  const onCreate = async () => {
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
    console.log("onBack");
    dispatch(initSignUpState());
    router.back()
  }

  return (
    <Layout.Container>
      <AppBar>
        <View />
        <Button onPress={() => navigation.goBack()} color='tertirary' endIcon={<FontAwesome6 name='xmark' size={16} color='black' />}>
          Cancel
        </Button>
      </AppBar>
      <Layout.Body>
        <ScrollView>
          <View>
            <Text.H1>My New</Text.H1>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Text.H1>Vault&nbsp;</Text.H1>
              <Text.H1 style={{ color: '#E5E5E5' }}>Info</Text.H1>
            </View>
            <View style={{ minWidth: 200, paddingTop: 8 }}>
              <Spacer />
              <TextField
                placeholder="Vault name"
                value={keyName}
                onChangeText={x => dispatch(setKeyName(x))}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Spacer />
            <View style={{ minWidth: 200, paddingTop: 8, paddingBottom: 8 }}>

              <ChainSelectView />

              <TextCopy text={phrase}>
                <Text.Body style={{ flexDirection: "row" }}>
                  <Octicons name="copy" size={12} color={colors.primary} />
                  <Text.Body > Your seed phrase: </Text.Body>
                  <Text.Body style={{ fontWeight: 700 }}>{phrase}</Text.Body>
                </Text.Body>
              </TextCopy>
              <Spacer />

              <Alert severity="error" message={error} />
              <Spacer />
              <Button onPress={onCreate} color="primary" loading={loading} >Create</Button>
              <Spacer space={8} />
              <Button onPress={onBack} color="secondary" disabled={loading}>Back</Button>
            </View>
          </View>
        </ScrollView>
        <ProgressViewModal />
      </Layout.Body>
    </Layout.Container >
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

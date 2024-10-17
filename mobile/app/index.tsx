import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Layout } from "@/components/index";
import Text from "@/components/text";
import { getInitialState, selectInitialized, selectMasterPassword, selectPath, signIn, signUp, useAppDispatch, useAppSelector } from "@/redux";
import * as Application from "expo-application";
import SignInView from "@/views/signin";
import SignUpView from "@/views/signup";

export default function Root() {
  const route = useRouter();

  const [error, setError] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();

  const appVersion = Application.nativeApplicationVersion;

  const appInitialized = useAppSelector(selectInitialized)
  const hasMasterPassword = useAppSelector(selectMasterPassword)
  const path = useAppSelector(selectPath);

  useEffect(() => {
    dispatch(getInitialState())
  }, []);

  const onCreateMasterPress = async (masterPassword: string) => {
    try {
      await dispatch(signUp({ masterPassword })).unwrap()

      naviateTo()

    } catch (error:any) {
      console.log("error", error.message);
      setError(error?.message);
    }
  }

  const onUnlokPress = async (masterPassword: string) => {
    try {
      await dispatch(signIn({ masterPassword })).unwrap()

      naviateTo()

    } catch (error:any) {
      console.log("error", error.message);
      setError(error?.message);
    }
  };

  const naviateTo = () => {
    console.log("path", path);
    if (path) {
      route.replace(path as string);
    } else {
      route.replace("/home");
    }
  }

  if (!appInitialized) {
    return (
      // TODO: avoid flickering
      <Layout.Container>
        <Layout.Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text.BodyMedium>Loading App...</Text.BodyMedium>
        </Layout.Body>
      </Layout.Container>
    );
  }

  return (
    <>
      <Layout.Container>
        <Layout.BodyAlignedBotton>
          <View style={{ alignItems: "center" }}>
            <Text.Title>gnoKey Mobile</Text.Title>
            <Text.Body>Key Management Tool</Text.Body>
            <Text.Caption1>v{appVersion}</Text.Caption1>
          </View>

          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            style={{ flex: 1 }}>
            {hasMasterPassword ? <SignInView onUnlokPress={onUnlokPress} error={error} /> : null}
            {!hasMasterPassword ? <SignUpView onCreateMasterPress={onCreateMasterPress} error={error} /> : null}
          </ScrollView>
        </Layout.BodyAlignedBotton>
      </Layout.Container>
    </>
  );
}

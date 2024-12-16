import { Stack } from "expo-router";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Guard } from "@/components/auth/guard";
import { GnoNativeProvider } from "@gnolang/gnonative";
import { LinkingProvider, ReduxProvider } from "@/providers";

const gnoDefaultConfig = {
  // @ts-ignore
  remote: process.env.EXPO_PUBLIC_GNO_REMOTE!,
  // @ts-ignore
  chain_id: process.env.EXPO_PUBLIC_GNO_CHAIN_ID!,
};

export default function AppLayout() {
  return (
    <GnoNativeProvider config={gnoDefaultConfig}>
      <ReduxProvider>
        <ThemeProvider value={DefaultTheme}>
        <LinkingProvider>
          <Guard>
            <Stack
              screenOptions={{
                headerShown: false,
                headerLargeTitle: true,
                headerBackVisible: false,
              }}
            />
          </Guard>
          </LinkingProvider>
        </ThemeProvider>
      </ReduxProvider>
    </GnoNativeProvider>
  );
}

import { Stack } from "expo-router";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Guard } from "@/components/auth/guard";
import { GnoNativeProvider } from "@gnolang/gnonative";
import { LinkingProvider, ReduxProvider } from "@/src/providers";

const gnoDefaultConfig = {
  remote: process.env.EXPO_PUBLIC_GNO_REMOTE!,
  chain_id: process.env.EXPO_PUBLIC_GNO_CHAIN_ID!,
  start_gnokey_mobile_service: true,
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

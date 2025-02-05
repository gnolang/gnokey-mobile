import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { Guard } from "@/components/auth/guard";
import { GnoNativeProvider } from "@gnolang/gnonative";
import { IndexerProvider, LinkingProvider, ReduxProvider } from "@/providers";
import { DefaultTheme } from "@/assets/styles";

const gnoDefaultConfig = {
  // @ts-ignore
  remote: process.env.EXPO_PUBLIC_GNO_REMOTE!,
  // @ts-ignore
  chain_id: process.env.EXPO_PUBLIC_GNO_CHAIN_ID!,
};

const indexerConfig = {
  remote: process.env.EXPO_PUBLIC_TXINDEXER_REMOTE!,
};

export default function AppLayout() {
  return (
    <GnoNativeProvider config={gnoDefaultConfig}>
      <IndexerProvider config={indexerConfig}>
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
      </IndexerProvider>
    </GnoNativeProvider>
  );
}

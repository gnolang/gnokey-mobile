import { Stack } from 'expo-router'
import { Guard } from '@/components/auth/guard'
import { GnoNativeProvider } from '@gnolang/gnonative'
import { IndexerProvider, LinkingProvider, ReduxProvider } from '@/providers'
import { ThemeProvider } from '@/modules/ui-components'
import defaultChains from '@/assets/chains.json'

// The first Chain into chains.json will be the default chain
export const DEFAULT_CHAIN = defaultChains[0]

const gnoDefaultConfig = {
  // @ts-ignore
  remote: DEFAULT_CHAIN.gnoAddress!,
  // @ts-ignore
  chain_id: DEFAULT_CHAIN.chainId!
}

const indexerConfig = {
  // @ts-ignore
  remote: DEFAULT_CHAIN.faucetAddress!
}

// Extend the BigInt interface to include toJSON
declare global {
  interface BigInt {
    toJSON(): string
  }
}

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}

export default function AppLayout() {
  return (
    <GnoNativeProvider config={gnoDefaultConfig}>
      <IndexerProvider config={indexerConfig}>
        <ReduxProvider>
          <ThemeProvider>
            <LinkingProvider>
              <Guard>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    headerLargeTitle: true,
                    headerBackVisible: false
                  }}
                />
              </Guard>
            </LinkingProvider>
          </ThemeProvider>
        </ReduxProvider>
      </IndexerProvider>
    </GnoNativeProvider>
  )
}

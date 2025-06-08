import { Stack } from 'expo-router'
import { Guard } from '@/components/auth/guard'
import { GnoNativeProvider } from '@gnolang/gnonative'
import { IndexerProvider, LinkingProvider, ReduxProvider } from '@/providers'
import { ThemeProvider } from '@/modules/ui-components'
import defaultChains from '@/assets/chains.json'
import { Initializer } from '@/providers/initializer-provider'

const gnoDefaultConfig = {
  // @ts-ignore
  remote: defaultChains[0].gnoAddress!,
  // @ts-ignore
  chain_id: defaultChains[0].chainId!
}

const indexerConfig = {
  // @ts-ignore
  remote: defaultChains[0].faucetAddress!
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
            <Initializer>
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
            </Initializer>
          </ThemeProvider>
        </ReduxProvider>
      </IndexerProvider>
    </GnoNativeProvider>
  )
}

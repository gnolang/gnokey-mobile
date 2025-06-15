import { GnoNativeProvider as GnoNative } from '@gnolang/gnonative'
import defaultChains from '@/assets/chains.json'

// The default chain will be replaced by the value loaded from the database in redux-provider.tsx
export const DEFAULT_CHAIN = defaultChains[0]

export function GnoNativeProvider({ children }: { children: React.ReactNode }) {
  const config = {
    // @ts-ignore
    remote: DEFAULT_CHAIN.rpcUrl!,
    // @ts-ignore
    chain_id: DEFAULT_CHAIN.chainId!
  }

  return <GnoNative config={config}>{children}</GnoNative>
}

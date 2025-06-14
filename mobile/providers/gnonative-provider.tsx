import { GnoNativeProvider as GnoNative } from '@gnolang/gnonative'
import defaultChains from '@/assets/chains.json'

// The first Chain into chains.json will be the default chain
export const DEFAULT_CHAIN = defaultChains[0]

export function GnoNativeProvider({ children }: { children: React.ReactNode }) {
  const config = {
    // @ts-ignoreƒ
    remote: DEFAULT_CHAIN.gnoAddress!,
    // @ts-ignore
    chain_id: DEFAULT_CHAIN.chainId!
  }

  return <GnoNative config={config}>{children}</GnoNative>
}

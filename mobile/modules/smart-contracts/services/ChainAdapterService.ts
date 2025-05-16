import { GnoNativeApi } from '@gnolang/gnonative'
import { GnoChainAdapter } from '../gno/GnoChainAdapter'
import { ChainAdapter } from '../base'

/**
 * Function to get the appropriate chain adapter based on the chain type.
 * @param chain - The chain type (e.g., 'gno', 'ethereum').
 * @param gnonative - An instance of GnoNativeApi for Gno chain.
 * @returns An instance of ChainAdapter for the specified chain.
 */
export function getChainAdapter(chain: 'gno', gnonative?: GnoNativeApi): ChainAdapter {
  switch (chain) {
    case 'gno':
      if (!gnonative) throw new Error('GnoNativeApi instance is required for Gno chain')
      return new GnoChainAdapter(gnonative)
    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

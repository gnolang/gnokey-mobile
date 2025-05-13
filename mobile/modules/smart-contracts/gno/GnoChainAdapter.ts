import { GnoNativeApi } from '@gnolang/gnonative'
import { GnoDocParser } from './docs/GnoDocParser'
import { ChainAdapter, ContractDoc } from '../base'
import { EstimateGnoGasParams } from './types'

const DEFAULT_GAS_MARGIN = 110 // 1.1%

export class GnoChainAdapter implements ChainAdapter {
  gnonative: GnoNativeApi
  constructor(gnonative: GnoNativeApi) {
    this.gnonative = gnonative
  }
  /**
   * Fetch the contract doc from gno.land and parse it
   * @param contractPath - contract path on gno.land, e.g. gno.land/r/gnoland/users/v1
   * @returns - the contract doc parsed
   */
  async fetchDoc(contractPath: string): Promise<ContractDoc> {
    const chainId = await this.gnonative.getChainID()
    const remote = await this.gnonative.getRemote()
    console.log('fetching contract doc on gno', chainId, remote)

    const data = Uint8Array.from(Array.from(contractPath).map((letter) => letter.charCodeAt(0)))
    const gnoDoc = await this.gnonative.query('vm/qdoc', data)
    const r = new TextDecoder('utf-8').decode(gnoDoc.result)
    return new GnoDocParser().parseDoc(JSON.parse(r))
  }

  /**
   * Estimate the gas for a contract function call
   * @returns - the estimated gas for the transaction
   */
  async estimateGas(params: EstimateGnoGasParams): Promise<bigint> {
    const { packagePath, fnc, args, gasFee, gasWanted, address, activateAccount } = params
    const addr = await this.gnonative.addressFromBech32(address)

    console.log(
      `estimating gas for ${fnc} on ${packagePath}, addr: ${addr}, gasFee: ${gasFee}, gasWanted: ${gasWanted}, args: ${args}`
    )
    try {
      // TODO
      await this.gnonative.activateAccount(activateAccount)
      await this.gnonative.setPassword(params.pass, addr)

      const res = await this.gnonative.makeCallTx(packagePath, fnc, args, gasFee, gasWanted, addr)

      const response = await this.gnonative.estimateGas(res.txJson, addr, DEFAULT_GAS_MARGIN, true)

      return response.gasWanted
    } catch (error) {
      console.error('Error estimating gas', error)
      throw error
    }
  }
}

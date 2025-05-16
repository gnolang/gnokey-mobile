import { ContractDoc, EstimateGasParams } from './types'

/**
 * Base interface for chain adapters
 */
export interface ChainAdapter {
  /**
   * Fetch the smart contract documentation from chain or another source
   * @param param - contract path, e.g. on gno: "gno.land/r/gnoland/users/v1"
   * @returns - the contract doc parsed
   */
  fetchDoc(param: string): Promise<ContractDoc>

  /**
   * Estimate the gas for a contract function call
   */
  estimateGas(params: EstimateGasParams): Promise<bigint>
}

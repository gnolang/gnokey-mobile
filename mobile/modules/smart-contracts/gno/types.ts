import { EstimateGasParams } from '../base'

export interface MakeCallTxParams {
  packagePath: string
  fnc: string
  args: string[]
  gasFee: string
  gasWanted: bigint
  address: string
}

export interface EstimateGnoGasParams extends EstimateGasParams {
  activateAccount: string
  pass: string
}

export interface ContractDoc {
  /** The contract name */
  name: string
  description: string
  methods: MethodDoc[]
}

export interface MethodDoc {
  /** The method name */
  name: string
  doc: string
  inputs: ParamDoc[]
  outputs: ParamDoc[]
}

export interface ParamDoc {
  name: string
  type: string
}

export interface EstimateGasParams {
  /** The package path of the contract */
  packagePath: string
  /** The function name to call */
  fnc: string
  /** The arguments to pass to the function */
  args: any[]
  /** The gas fee to use */
  gasFee: string
  /** The gas wanted for the transaction */
  gasWanted: bigint
  /** The address of the account to use */
  address: string
}

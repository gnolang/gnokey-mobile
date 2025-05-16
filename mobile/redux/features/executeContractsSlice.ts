import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import { GnoNativeApi } from '@gnolang/gnonative'
import { getChainAdapter } from '@/modules/smart-contracts/services/ChainAdapterService'
import { ContractDoc } from '@/modules/smart-contracts/base'
import { EstimateGnoGasParams } from '@/modules/smart-contracts/gno/types'
import { WebLinkDecoder } from '@/modules/smart-contracts/base/WebLinkDecoder'
import { RootState } from '../root-reducer'

export interface ExecuteContractsState {
  loading: boolean
  error?: string
  doc?: ContractDoc
  func?: string
  estimateGas?: bigint
}

const initialState: ExecuteContractsState = {} as ExecuteContractsState

export const executeContractsSlice = createSlice({
  name: 'executeContracts',
  initialState,
  reducers: {
    clearExecute: (state) => {
      state = initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(prepareToExecuteContract.pending, (state) => {
      console.log('queryGnoDoc pending')
      state.loading = true
      state.error = undefined
    })
    builder.addCase(prepareToExecuteContract.fulfilled, (state, action) => {
      console.log('queryGnoDoc fulfilled', action.payload)
      state.doc = action.payload.doc
      state.func = action.payload.func
      state.estimateGas = action.payload.estimateGas
      state.loading = false
    })
    builder.addCase(prepareToExecuteContract.rejected, (state, action) => {
      console.error('queryGnoDoc rejected', action.error)
      state.error = action.error.message
      state.loading = false
    })
  },
  selectors: {
    /** Returns the FULL contract doc */
    selectDoc: (state: ExecuteContractsState) => state.doc,
    /** Returns the function doc */
    selectFuncDoc: (state: ExecuteContractsState) => {
      if (!state.doc) return undefined
      if (!state.func) return undefined
      const func = state.doc.methods.find((f) => f.name === state.func)
      if (!func) return undefined
      return {
        doc: state.doc,
        func: func
      }
    },
    /** Returns the function to execute */
    selectFunc: (state: ExecuteContractsState) => state.func,
    /** Returns the estimated gas to execute the contract */
    selectExtimateGas: (state: ExecuteContractsState) => state.estimateGas,
    selectLoadingContract: (state: ExecuteContractsState) => state.loading,
    selectError: (state: ExecuteContractsState) => state.error
  }
})

export const { selectDoc, selectLoadingContract, selectError, selectFunc, selectExtimateGas, selectFuncDoc } =
  executeContractsSlice.selectors
export const { clearExecute } = executeContractsSlice.actions

/** This function will be called when the user clicks on a link containing an
 * action to execute a smart contract.
 * It will parse the URL and fetch the contract doc and extimate the gas.
 * */
export const prepareToExecuteContract = createAsyncThunk<
  {
    doc: ContractDoc
    func: string | undefined
    estimateGas: bigint
  },
  string,
  ThunkExtra
>('executeContracts/prepareToExecuteContract', async (url, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

  // decode the URL, extraact the params
  const webLink = new WebLinkDecoder(url)

  // TODO: use the chainId and remote baseed on URL link origin
  await gnonative.setChainID('dev')
  await gnonative.setRemote('http://localhost:26657')

  try {
    if (!webLink.chainType) throw new Error('No chain type found in URL')
    if (!webLink.packagePath()) throw new Error('No package path found in URL')
    if (!webLink.func) throw new Error('No function found in URL')

    const adapter = getChainAdapter(webLink.chainType, gnonative)

    const doc = await adapter.fetchDoc(webLink.packagePath())

    console.log('webLink', JSON.stringify(webLink))

    const masterPass = (thunkAPI.getState() as RootState).signIn.masterPassword

    const params: EstimateGnoGasParams = {
      packagePath: webLink.packagePath(),
      fnc: webLink.func,
      args: webLink.funcArg() || [],
      gasFee: '1000000ugnot', // TODO: should we use the maximum gas fee?
      gasWanted: BigInt(10000000), // TODO: should we use the maximum gas fee?
      address: 'g18r356vy0etd09dnlmvgq23elpae8hzx2ds7swq', // TODO: get if from Gnokey
      activateAccount: 'devkey123', // TODO: get if from Gnokey
      pass: masterPass || ''
    }

    const estimateGas = await adapter.estimateGas(params)

    return {
      doc,
      func: webLink.func,
      estimateGas
    }
  } catch (error) {
    console.error('Error querying gnoDoc', error)
    throw error
  }
})

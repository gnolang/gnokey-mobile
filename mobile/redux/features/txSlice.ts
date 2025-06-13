import { ThunkExtra } from '@/providers/redux-provider'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GnoNativeApi, KeyInfo, SignTxResponse } from '@gnolang/gnonative'
import { RootState } from '../root-reducer'

const DEFAULT_GAS_MARGIN = 110 // 1.1%

export const broadcastTx = createAsyncThunk<any, { signedTx: string }, ThunkExtra>(
  'broadcast/broadcastTx',
  async ({ signedTx }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

    let response
    for await (const res of await gnonative.broadcastTxCommit(signedTx)) {
      response = res
    }

    if (!response) {
      throw new Error('BroadcastTxCommit response is undefined.')
    }

    console.log('BroadcastTxCommit response:', response)

    try {
      return new TextDecoder('utf-8').decode(response.result)
    } catch (error) {
      console.error('Error parsing response:', error)
      throw new Error('Failed to parse response.')
    }
  }
)

export const signTx = createAsyncThunk<SignTxResponse, { keyInfo: KeyInfo }, ThunkExtra>(
  'linking/signTx',
  async ({ keyInfo }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { txInput } = (thunkAPI.getState() as RootState).linking
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn

    if (!masterPassword) {
      throw new Error('No keyInfo found.')
    }

    const txJson = decodeURIComponent(txInput || '')
    console.log('txJson', txJson)
    console.log('keyInfo', JSON.stringify(keyInfo))

    const res = await gnonative.activateAccount(keyInfo.name)
    console.log('activateAccount', res)

    await gnonative.setPassword(masterPassword, keyInfo.address)
    console.log('selected account', keyInfo.name)

    const signedTx = await gnonative.signTx(txJson, keyInfo?.address)
    console.log('signedTx', signedTx)

    return signedTx
  }
)

interface gasEstimation {
  tx: string
  gasWanted: bigint
}

/**
 * Estimates the gas wanted value for the transaction.
 * If the `update` field is true, the transaction will be updated with the new gas wanted value
 */
export const estimateGasWanted = createAsyncThunk<gasEstimation, { keyInfo: KeyInfo; updateTx: boolean }, ThunkExtra>(
  'linking/estimateGas',
  async ({ keyInfo, updateTx }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { txInput } = (thunkAPI.getState() as RootState).linking
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn

    if (!masterPassword) {
      throw new Error('No keyInfo found.')
    }

    const txJson = decodeURIComponent(txInput || '')

    await gnonative.activateAccount(keyInfo.name)
    await gnonative.setPassword(masterPassword, keyInfo.address)

    // Estimate the gas used
    const response = await gnonative.estimateGas(txJson, keyInfo?.address, DEFAULT_GAS_MARGIN, updateTx)
    const gasWanted = response.gasWanted as bigint
    console.log('estimateGas: ', gasWanted)

    // Update the transaction
    if (updateTx) {
      return { tx: response.txJson, gasWanted: gasWanted }
    }

    return { tx: txJson, gasWanted }
  }
)

export interface TxState {
  /** The status of the broadcasted transaction */
  broadcastStatus?: 'pending' | 'fulfilled' | 'rejected'
  /** The response of the broadcasting a transaction */
  broadcastTxResponse?: string
}

const initialState: TxState = {
  broadcastTxResponse: undefined,
  broadcastStatus: 'fulfilled'
}

export const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(broadcastTx.fulfilled, (state, action) => {
      state.broadcastTxResponse = action.payload
      state.broadcastStatus = 'fulfilled'
    })
    builder.addCase(broadcastTx.rejected, (state, _) => {
      state.broadcastTxResponse = undefined
      state.broadcastStatus = 'rejected'
    })
    builder.addCase(broadcastTx.pending, (state) => {
      state.broadcastTxResponse = undefined
      state.broadcastStatus = 'pending'
    })
  },
  selectors: {
    selectBroadcastResponse: (state) => state.broadcastTxResponse,
    selectBroadcastStatus: (state) => state.broadcastStatus
  }
})

export const { selectBroadcastResponse, selectBroadcastStatus } = txSlice.selectors

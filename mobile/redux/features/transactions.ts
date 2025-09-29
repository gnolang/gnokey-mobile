import { ThunkExtra } from '@/providers/redux-provider'
import { BroadcastTxCommitResponse, Coin, EstimateGasResponse, GnoNativeApi } from '@gnolang/gnonative'
import { createAsyncThunk, createSlice, RootState } from '@reduxjs/toolkit'

export interface TxState {
  form: {
    fromAddress: string // wallet address
    toAddress: string // recipient address
    amount: string // raw string to keep user input precise
    memo?: string // optional
  }
  status: 'idle' | 'validating' | 'signing' | 'broadcasting' | 'success' | 'error'
  error?: string | null
  txHash?: string | null

  signedTx?: string // signed transaction JSON
  gasWanted?: bigint // estimated gas wanted
}

const initialState: TxState = {
  form: {
    fromAddress: '',
    toAddress: '',
    amount: '',
    memo: ''
  },
  status: 'idle',
  error: null,
  txHash: null,

  signedTx: undefined,
  gasWanted: undefined
}

export const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setTxFormField: (state, action) => {
      const { field, value } = action.payload
      state.form = {
        ...state.form,
        [field]: value
      }
    },
    resetTxState: (state) => {
      state = initialState
    }
  },
  extraReducers(builder) {
    // txGasFeeEstimation
    builder
      .addCase(txGasFeeEstimation.fulfilled, (state, action) => {
        state.signedTx = action.payload.txJson
        state.gasWanted = action.payload.gasWanted
        state.status = 'success'
      })
      .addCase(txGasFeeEstimation.pending, (state) => {
        state.status = 'validating'
        state.error = null
      })
      .addCase(txGasFeeEstimation.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message || 'Gas estimation failed'
      })
    // txBroadcast
    builder
      .addCase(txBroadcast.fulfilled, (state, action) => {
        const hashString = uint8ArrayToHex(action.payload?.hash)
        console.log('Transaction hash: ', hashString)
        state.status = 'success'
        state.txHash = hashString
      })
      .addCase(txBroadcast.pending, (state) => {
        state.status = 'broadcasting'
        state.error = null
      })
      .addCase(txBroadcast.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message || 'Transaction broadcast failed'
      })
  },
  selectors: {
    selectTxGasWanted: (state) => state.gasWanted,
    selectTxFormMemo: (state) => state.form.memo,
    selectTxFormAmount: (state) => state.form.amount,
    selectTxFormToAddress: (state) => state.form.toAddress,
    selectTxForm: (state) => state.form
  }
})

function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const { setTxFormField, resetTxState } = txSlice.actions
export const { selectTxGasWanted, selectTxFormMemo, selectTxFormAmount, selectTxFormToAddress, selectTxForm } = txSlice.selectors

interface TxBroadcastProp {
  fromAddress: Uint8Array
}

export const txBroadcast = createAsyncThunk<BroadcastTxCommitResponse, TxBroadcastProp, ThunkExtra>(
  'tx/txBroadcast',
  async (params, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { fromAddress } = params
    const signedTx = (thunkAPI.getState() as RootState).tx.signedTx
    if (!signedTx) throw new Error('No signed transaction found')

    const fromAddressBech32 = await gnonative.addressToBech32(fromAddress)
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn
    await gnonative.activateAccount(fromAddressBech32)
    await gnonative.setPassword(masterPassword || '', fromAddress)

    console.log('Broadcasting transaction: ', signedTx)
    const signed = await gnonative.signTx(signedTx, fromAddress)
    let res: BroadcastTxCommitResponse | null = null
    for await (res of await gnonative.broadcastTxCommit(signed.signedTxJson)) {
      console.log('Broadcast result: ', res)
    }
    if (!res) {
      throw new Error('No response from broadcastTxCommit')
    }
    return res
  }
)

export const txGasFeeEstimation = createAsyncThunk<EstimateGasResponse, void, ThunkExtra>(
  'tx/gasFeeEstimation',
  async (_, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    console.log('Starting gas fee estimation...')

    const { memo, amount, toAddress, fromAddress } = (thunkAPI.getState() as RootState).tx.form
    console.log('xxx', { fromAddress, toAddress, amount, memo })

    console.log('toAddressX: ', toAddress)
    const toAddressA = await gnonative.addressFromBech32(toAddress)
    console.log('toAddressA: ', toAddressA)
    const fromAddressUint8Array = await gnonative.addressFromBech32(fromAddress)
    console.log('fromAddressUint8Array: ', fromAddressUint8Array)
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn

    console.log('Estimating gas for transfer: ', { fromAddress, toAddress, amount, memo })

    if (!masterPassword) throw new Error('No master password found')

    await gnonative.activateAccount(fromAddress)
    await gnonative.setPassword(masterPassword, fromAddressUint8Array)

    const amoun_ugnot = {
      denom: 'ugnot',
      amount: Math.round(Number(amount) * 1_000_000).toString() // Convert to uGNOT
    } as unknown as Coin

    const gasWanted = 2000000n

    const res = await gnonative.makeSendTx(toAddressA, [amoun_ugnot], '1000000ugnot', gasWanted, fromAddressUint8Array, memo)

    const DEFAULT_GAS_MARGIN = 110 // 1.1%
    const updateTx = true
    const estimateGas = await gnonative.estimateGas(res.txJson, fromAddressUint8Array, DEFAULT_GAS_MARGIN, updateTx)
    const gasWantedX = estimateGas.gasWanted as bigint
    console.log('estimateGas  gasWantedX: ', gasWantedX)
    console.log('estimateGas estimateGas: ', estimateGas.txJson)
    return estimateGas
  }
)

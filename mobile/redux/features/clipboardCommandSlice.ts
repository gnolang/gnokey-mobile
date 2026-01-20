import { ParsedCommand } from '@/modules/utils/commandParser'
import { DEFAULT_GAS_MARGIN, DEFAULT_STORAGE_MARGIN } from '@/modules/utils/transactions'
import { ThunkExtra } from '@/providers/redux-provider'
import { BroadcastTxCommitResponse, EstimateTxFeesResponse, GnoNativeApi } from '@gnolang/gnonative'
import { createSlice, createAsyncThunk, PayloadAction, RootState } from '@reduxjs/toolkit'
import { selectVaultToEditWithBalance, selectMasterPassword } from '@/redux'

export interface ClipboardCommandState {
  parsedCommand: ParsedCommand | null
  estimatedTxCommand: EstimateTxFeesResponse | null
  loading?: string
  error: string | null
}

const initialState: ClipboardCommandState = {
  parsedCommand: null,
  estimatedTxCommand: null,
  loading: undefined,
  error: null
}

export const clipboardCommandSlice = createSlice({
  name: 'clipboardCommand',
  initialState,
  reducers: {
    setParsedCommand: (state, action: PayloadAction<ParsedCommand | null>) => {
      state.parsedCommand = action.payload
    },
    dismissCommand: (state) => {
      state.parsedCommand = null
      state.estimatedTxCommand = null
      state.error = null
    }
  },

  extraReducers: (builder) => {
    builder
      // signTxCommand:
      .addCase(signTxCommand.fulfilled, (state, action) => {
        state.loading = undefined
      })
      .addCase(signTxCommand.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = undefined
      })
      .addCase(signTxCommand.pending, (state, action) => {
        state.error = null
        state.loading = action.meta.arg.broadcast ? 'Signing and broadcasting transaction...' : 'Signing transaction...'
      })
      // estimateTxCommand:
      .addCase(estimateTxCommand.fulfilled, (state, action) => {
        state.estimatedTxCommand = action.payload
        state.error = null
        state.loading = undefined
      })
      .addCase(estimateTxCommand.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = undefined
      })
      .addCase(estimateTxCommand.pending, (state) => {
        state.error = null
        state.loading = 'Estimating transaction fees...'
      })
  }
})

export const signTxCommand = createAsyncThunk<void, { broadcast: boolean }, ThunkExtra>(
  'clipboardCommand/signTxCommand',
  async ({ broadcast }, { getState, rejectWithValue, extra }) => {
    try {
      const state = getState() as RootState
      const extimatedTx = selectEstimatedTxCommand(state)
      const vault = selectVaultToEditWithBalance(state)
      const masterPassword = selectMasterPassword(state)

      if (!extimatedTx || !vault || !masterPassword) {
        return rejectWithValue('No command to sign or vault or masterPassword available')
      }

      const gnonative = extra.gnonative as GnoNativeApi
      await gnonative.activateAccount(vault.keyInfo.name)
      await gnonative.setPassword(masterPassword, vault.keyInfo.address)

      console.log('Signing command txJson:', extimatedTx.txJson)
      console.log('Using vault:', JSON.stringify(vault.keyInfo.address))

      const { signedTxJson } = await gnonative.signTx(extimatedTx.txJson, vault.keyInfo.address)
      console.log('Signed tx: ', signedTxJson)

      let res: BroadcastTxCommitResponse | null = null
      for await (res of await gnonative.broadcastTxCommit(signedTxJson)) {
        console.log('Broadcast result: ', res)
      }
      if (!res) {
        throw new Error('No response from broadcastTxCommit')
      }

      return
    } catch (error: any) {
      console.error('Error in signTxCommand:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const estimateTxCommand = createAsyncThunk<EstimateTxFeesResponse, void, ThunkExtra>(
  'signTxCommand/estimateTxCommand',
  async (_, { getState, rejectWithValue, extra }) => {
    const gnonative = extra.gnonative as GnoNativeApi

    const state = getState() as RootState
    const parsedCommand = selectParsedCommand(state)
    const vault = selectVaultToEditWithBalance(state)

    if (!vault || !parsedCommand) {
      return rejectWithValue('No vault or parsedCommand available for fee estimation')
    }

    const txJsonInput = JSON.stringify(parsedCommand)
    console.log('Estimating fees for command txJson:', txJsonInput)

    const packagePath = parsedCommand.pkgPath
    const fnc = parsedCommand.func
    const args: string[] = parsedCommand.args || []
    const gasFee = '1000000ugnot'
    const gasWanted = BigInt(50000000)
    const address = vault.keyInfo.address

    const res = await gnonative.makeCallTx(packagePath, fnc, args, gasFee, gasWanted, address)

    const extimatedTx = await gnonative.estimateTxFees(
      res.txJson,
      vault.keyInfo.address,
      DEFAULT_GAS_MARGIN,
      DEFAULT_STORAGE_MARGIN,
      true
    )
    console.log('Estimated' + JSON.stringify(extimatedTx))
    return extimatedTx
  }
)

export const { setParsedCommand, dismissCommand } = clipboardCommandSlice.actions

export const selectParsedCommand = (state: RootState) => state.clipboardCommand.parsedCommand

export const selectClipboardError = (state: RootState) => state.clipboardCommand.error

export const selectEstimatedTxCommandValue = (state: RootState) => state.clipboardCommand.estimatedTxCommand?.totalFee

export const selectEstimatedTxCommand = (state: RootState) => state.clipboardCommand.estimatedTxCommand

export const selectClipboardCommandLoading = (state: RootState) => state.clipboardCommand.loading

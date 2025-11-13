import { createAsyncThunk, createSlice, RootState } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import { GnoNativeApi, KeyInfo } from '@gnolang/gnonative'
import * as Linking from 'expo-linking'
import { Vault } from '@/types'
import { getChainById } from '@/providers/database-provider'

const DEFAULT_GAS_MARGIN = 110 // 110%
const DEFAULT_STORAGE_MARGIN = 100 // 100%

export interface LinkingState {
  chainId?: string
  remote?: string
  clientName?: string
  reason?: string
  bech32Address?: string
  /* The keyinfo of the selected account 'bech32Address' */
  keyinfo?: KeyInfo
  /* The transaction to be signed, in JSON format */
  txInput?: string
  signedTxJson?: string
  txFee?: bigint
  /* Update the transaction with the new estimated gas wanted and gas fee values */
  updateTx?: boolean
  /* The callback URL to return to after each operation */
  callback?: string
  /* The path of the requested screen */
  path?: string | 'tosignin'
  hostname?: string
  /* The session key info */
  session?: string
  session_wanted?: boolean
  isLoading?: boolean
}

const initialState: LinkingState = {
  chainId: undefined,
  remote: undefined,
  clientName: undefined,
  reason: undefined,
  bech32Address: undefined,
  txInput: undefined,
  signedTxJson: undefined,
  updateTx: undefined,
  callback: undefined,
  path: undefined,
  hostname: undefined,
  session: undefined,
  session_wanted: false,
  txFee: undefined,
  isLoading: false
}

/**
 * Send the address to the soliciting app
 */
export const sendAddressToSoliciting = createAsyncThunk<void, { vault: Vault }, ThunkExtra>(
  'linking/sendAddressToSoliciting',
  async ({ vault }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { callback } = (thunkAPI.getState() as RootState).linking

    console.log('sendAddressToSoliciting callback', callback)

    if (!callback) {
      throw new Error('No callback found.')
    }

    const bech32 = await gnonative.addressToBech32(vault.keyInfo.address)

    let network
    if (vault.chain) {
      network = await getChainById(vault.chain.id)
    }

    console.log('sendAddressToSoliciting', bech32, network?.rpcUrl)

    Linking.openURL(
      `${callback}?address=${encodeURIComponent(bech32)}&remote=${encodeURIComponent(network?.rpcUrl ?? '')}&chain_id=${encodeURIComponent(network?.chainId ?? '')}&cachekill=${Date.now()}`
    )
  }
)

interface FeeEstimationResponse {
  txJson: string
  txFee: bigint
  signedTxJson: string
}

// estimateTxFeeAndSign estimates the fee for the transaction and signs it.
// If the `update` field is true, the transaction will be updated with the new gas wanted and gas fee values.
export const estimateTxFeeAndSign = createAsyncThunk<FeeEstimationResponse, void, ThunkExtra>(
  'linking/estimateTxFeeAndSign',
  async (_, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { txInput, keyinfo } = (thunkAPI.getState() as RootState).linking
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn

    if (!masterPassword) {
      throw new Error('No keyInfo found.')
    }
    if (!keyinfo) {
      throw new Error('No keyInfo found.')
    }

    const txJsonInput = decodeURIComponent(txInput || '')
    await gnonative.activateAccount(keyinfo.name)
    await gnonative.setPassword(masterPassword, keyinfo.address)

    const fees = await gnonative.estimateTxFees(txJsonInput, keyinfo?.address, DEFAULT_GAS_MARGIN, DEFAULT_STORAGE_MARGIN, true)
    const { signedTxJson } = await gnonative.signTx(fees.txJson, keyinfo?.address)

    return { txJson: fees.txJson, txFee: fees.totalFee!.amount, signedTxJson }
  }
)

interface SetLinkResponse {
  chainId?: string
  remote?: string
  reason?: string
  clientName?: string
  bech32Address?: string
  txInput?: string
  updateTx?: boolean
  callback?: string
  path: string
  keyinfo?: KeyInfo
  hostname?: string
  session?: string
  session_wanted: boolean
}

/**
 * Set the linking data from the parsed URL received from the linking event
 */
export const setLinkingData = createAsyncThunk<SetLinkResponse, Linking.ParsedURL, ThunkExtra>(
  'linking/setLinkingData',
  async (parsedURL, thunkAPI) => {
    const queryParams = parsedURL.queryParams
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

    const bech32Address = queryParams?.address ? (queryParams.address as string).trim() : undefined
    let keyinfo: KeyInfo | undefined

    if (bech32Address) {
      const keyinfos = await gnonative.listKeyInfo()
      for (const k of keyinfos) {
        const kAddress = await gnonative.addressToBech32(k.address)
        if (kAddress === bech32Address) {
          keyinfo = k
          break
        }
      }
    }

    let updateTx = false
    if (queryParams?.update_tx && (queryParams.update_tx as string) === 'true') {
      updateTx = true
    }

    return {
      chainId: queryParams?.chain_id ? (queryParams.chain_id as string) : undefined,
      remote: queryParams?.remote ? (queryParams.remote as string) : undefined,
      hostname: parsedURL.hostname || undefined,
      reason: queryParams?.reason ? (queryParams.reason as string) : undefined,
      clientName: queryParams?.client_name ? (queryParams.client_name as string) : undefined,
      bech32Address,
      txInput: queryParams?.tx ? (queryParams.tx as string) : undefined,
      updateTx: updateTx,
      callback: queryParams?.callback ? decodeURIComponent(queryParams.callback as string) : undefined,
      path: (queryParams?.path as string) || '',
      keyinfo,
      session: queryParams?.session ? (queryParams.session as string) : undefined,
      session_wanted: queryParams?.session_wanted ? Boolean(queryParams.session_wanted) : false
    }
  }
)

export const linkingSlice = createSlice({
  name: 'linking',
  initialState,
  reducers: {
    resetLinkState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(estimateTxFeeAndSign.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(estimateTxFeeAndSign.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(estimateTxFeeAndSign.fulfilled, (state, action) => {
      state.txFee = action.payload.txFee
      state.signedTxJson = action.payload.signedTxJson
      state.isLoading = false
    })
    builder.addCase(setLinkingData.fulfilled, (state, action) => {
      state.chainId = action.payload.chainId
      state.remote = action.payload.remote
      state.reason = action.payload.reason
      state.clientName = action.payload.clientName
      state.bech32Address = action.payload.bech32Address
      state.txInput = action.payload.txInput
      state.updateTx = action.payload.updateTx
      state.callback = action.payload.callback
      state.path = action.payload.path
      state.keyinfo = action.payload.keyinfo
      state.hostname = action.payload.hostname
      state.session = action.payload.session
      state.session_wanted = action.payload.session_wanted
    })
  },
  selectors: {
    selectChainId: (state) => state.chainId,
    selectRemote: (state) => state.remote,
    selectTxInput: (state) => state.txInput,
    selectUpdateTx: (state) => state.updateTx,
    selectCallback: (state) => state.callback,
    selectBech32Address: (state) => state.bech32Address,
    selectClientName: (state) => state.clientName,
    selectKeyInfo: (state) => state.keyinfo,
    reasonSelector: (state) => state.reason,
    selectAction: (state) => (state.hostname !== expo_default ? state.hostname : undefined),
    selectSession: (state) => state.session,
    selectSessionWanted: (state) => state.session_wanted,
    selectSignedTx: (state) => state.signedTxJson,
    selectTxFee: (state) => state.txFee,
    selectLinkIsLoading: (state) => state.isLoading
  }
})

// Expo default hostname
const expo_default = 'expo-development-client'

export const { resetLinkState } = linkingSlice.actions

export const {
  selectTxInput,
  selectUpdateTx,
  selectCallback,
  selectBech32Address,
  selectClientName,
  reasonSelector,
  selectKeyInfo,
  selectAction,
  selectChainId,
  selectRemote,
  selectSession,
  selectSessionWanted,
  selectSignedTx,
  selectTxFee,
  selectLinkIsLoading
} = linkingSlice.selectors

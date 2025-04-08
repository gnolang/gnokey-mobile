import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import { GnoNativeApi, KeyInfo, SignTxResponse } from '@gnolang/gnonative'
import * as Linking from 'expo-linking'
import { RootState } from '../root-reducer'

export interface LinkingState {
  chainId?: string
  remote?: string
  clientName?: string
  reason?: string
  bech32Address?: string
  /* The keyinfo of the selected account 'bech32Address' */
  keyinfo?: KeyInfo
  txInput?: string
  /* The callback URL to return to after each operation */
  callback?: string
  /* The path of the requested screen */
  path?: string | 'tosignin'
  hostname?: string
  /* The session key info */
  session?: string
  session_wanted?: boolean
}

const initialState: LinkingState = {
  chainId: undefined,
  remote: undefined,
  clientName: undefined,
  reason: undefined,
  bech32Address: undefined,
  txInput: undefined,
  callback: undefined,
  path: undefined,
  hostname: undefined,
  session: undefined,
  session_wanted: false
}

/**
 * Send the address to the soliciting app
 */
export const sendAddressToSoliciting = createAsyncThunk<void, { keyInfo: KeyInfo }, ThunkExtra>(
  'linking/sendAddressToSoliciting',
  async ({ keyInfo }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { callback } = (thunkAPI.getState() as RootState).linking

    console.log('sendAddressToSoliciting', keyInfo, callback)

    if (!callback) {
      throw new Error('No callback found.')
    }

    const temp = await gnonative.addressToBech32(keyInfo?.address)
    const bech32 = await gnonative.addressToBech32(keyInfo?.address)

    Linking.openURL(callback + '?address=' + bech32 + '&cachekill=' + new Date().getTime())
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

interface SetLinkResponse {
  chainId?: string
  remote?: string
  reason?: string
  clientName?: string
  bech32Address?: string
  txInput?: string
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

    const bech32Address = queryParams?.address ? (queryParams.address as string) : undefined
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

    return {
      chainId: queryParams?.chain_id ? (queryParams.chain_id as string) : undefined,
      remote: queryParams?.remote ? (queryParams.remote as string) : undefined,
      hostname: parsedURL.hostname || undefined,
      reason: queryParams?.reason ? (queryParams.reason as string) : undefined,
      clientName: queryParams?.client_name ? (queryParams.client_name as string) : undefined,
      bech32Address,
      txInput: queryParams?.tx ? (queryParams.tx as string) : undefined,
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
    clearLinking: (state) => {
      state = { ...initialState }
      state.hostname = undefined
      state.txInput = undefined
      state.callback = undefined
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setLinkingData.fulfilled, (state, action) => {
      state.chainId = action.payload.chainId
      state.remote = action.payload.remote
      state.reason = action.payload.reason
      state.clientName = action.payload.clientName
      state.bech32Address = action.payload.bech32Address
      state.txInput = action.payload.txInput
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
    selectCallback: (state) => state.callback,
    selectBech32Address: (state) => state.bech32Address,
    selectClientName: (state) => state.clientName,
    selectKeyInfo: (state) => state.keyinfo,
    reasonSelector: (state) => state.reason,
    selectAction: (state) => (state.hostname !== expo_default ? state.hostname : undefined),
    selectSession: (state) => state.session,
    selectSessionWanted: (state) => state.session_wanted
  }
})

// Expo default hostname
const expo_default = 'expo-development-client'

export const { clearLinking } = linkingSlice.actions

export const {
  selectTxInput,
  selectCallback,
  selectBech32Address,
  selectClientName,
  reasonSelector,
  selectKeyInfo,
  selectAction,
  selectChainId,
  selectRemote,
  selectSession,
  selectSessionWanted
} = linkingSlice.selectors

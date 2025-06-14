import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GnoNativeApi } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'
import { RootState } from '../root-reducer'
import { NetworkMetainfo } from '@/types'
import defaultChains from '@/assets/chains.json'
import { insertChain } from '@/providers/database-provider'
import { DEFAULT_CHAIN } from '@/providers/gnonative-provider'

export interface ChainsState {
  chains: NetworkMetainfo[]
  currentChain?: NetworkMetainfo
}

const initialState: ChainsState = {
  chains: defaultChains,
  currentChain: DEFAULT_CHAIN
}

export const chainsSlice = createSlice({
  name: 'chains',
  initialState,
  reducers: {
    addCustomChain: (state, action: PayloadAction<NetworkMetainfo>) => {
      state.chains = state.chains ? [...state.chains, action.payload] : [action.payload]
    }
  },
  selectors: {
    selectChainsAvailable: (state) => state.chains,
    selectCurrentChain: (state) => state.currentChain
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentChain.fulfilled, (state, action) => {
      state.currentChain = action.payload
    })
    builder.addCase(setCurrentChain.fulfilled, (state, action) => {
      state.currentChain = action.payload
    })
    builder.addCase(saveChain.fulfilled, (state, action) => {
      state.chains.push(action.payload)
    })
  }
})

export const saveChain = createAsyncThunk<NetworkMetainfo, NetworkMetainfo, ThunkExtra>(
  'chains/saveChain',
  async (chain, thunkAPI) => {
    await insertChain({
      chainId: chain.chainId,
      chainName: chain.chainName,
      rpcUrl: chain.gnoAddress,
      faucetUrl: chain.faucetAddress || ''
    })
    return chain
  }
)

export const setCurrentChain = createAsyncThunk<NetworkMetainfo, NetworkMetainfo, ThunkExtra>(
  'chains/setCurrentChain',
  async (chain, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    gnonative.setRemote(chain.gnoAddress)
    gnonative.setChainID(chain.chainId)
    return chain
  }
)

export const getCurrentChain = createAsyncThunk<NetworkMetainfo | undefined, void, ThunkExtra>(
  'chains/getCurrentChain',
  async (_, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const remote = await gnonative.getRemote()
    const combinedChains = selectChainsAvailable(thunkAPI.getState() as RootState)
    const currentChain = combinedChains.find((chain: NetworkMetainfo) => chain.gnoAddress === remote)
    if (!currentChain) {
      // chain not found can indicate some changed on gnoAddress. So, we need to update the current selection.
      // TODO: inform the user that the current chain is not available anymore.
      return undefined
    }
    console.log('currentChain', currentChain)
    return currentChain
  }
)

export const { selectChainsAvailable, selectCurrentChain } = chainsSlice.selectors
export const { addCustomChain } = chainsSlice.actions

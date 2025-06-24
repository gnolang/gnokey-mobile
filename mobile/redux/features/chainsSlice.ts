import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GnoNativeApi } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'
import { NetworkMetainfo } from '@/types'
import { insertChain, updateActiveChain } from '@/providers/database-provider'

export interface ChainsState {
  chains: NetworkMetainfo[]
  currentChain?: NetworkMetainfo
}

const initialState: ChainsState = {
  chains: [],
  currentChain: undefined
}

export const chainsSlice = createSlice({
  name: 'chains',
  initialState,
  reducers: {},
  selectors: {
    selectChainsAvailable: (state) => state.chains,
    selectCurrentChain: (state) => state.currentChain
  },
  extraReducers: (builder) => {
    builder.addCase(setCurrentChain.fulfilled, (state, action) => {
      state.currentChain = action.payload
    })
    builder.addCase(saveChain.fulfilled, (state, action) => {
      state.chains.push(action.payload)
    })
  }
})

export const saveChain = createAsyncThunk<NetworkMetainfo, NetworkMetainfo, ThunkExtra>('chains/saveChain', async (chain, _) => {
  await insertChain({
    chainId: chain.chainId,
    chainName: chain.chainName,
    rpcUrl: chain.rpcUrl,
    faucetUrl: chain.faucetUrl || '',
    active: false // new chains are not active by default
  })
  return chain
})

export const setCurrentChain = createAsyncThunk<NetworkMetainfo, NetworkMetainfo, ThunkExtra>(
  'chains/setCurrentChain',
  async (chain, thunkAPI) => {
    await updateActiveChain(chain.id)
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    gnonative.setRemote(chain.rpcUrl)
    gnonative.setChainID(chain.chainId)
    return chain
  }
)

// /**
//  * Fetches the current chain from redux state and sets it in the GnoNative API.
//  * This is used to ensure that the GnoNative API is always in sync with the current chain
//  * selected in the app.
//  */
// export const synchronizeStateChain = createAsyncThunk<void, void, ThunkExtra>('chains/getCurrentChain', async (_, thunkAPI) => {
//   const currentChain = (thunkAPI.getState() as RootState).chains.currentChain
//   if (!currentChain) {
//     throw new Error('Current chain is not set. Please set a chain before synchronizing state.')
//   }
//   const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
//   await gnonative.setRemote(currentChain.rpcUrl)
//   await gnonative.setChainID(currentChain.chainId)
// })

export const { selectChainsAvailable, selectCurrentChain } = chainsSlice.selectors

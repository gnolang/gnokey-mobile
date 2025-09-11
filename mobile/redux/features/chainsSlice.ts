import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GnoNativeApi } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'
import { NetworkMetainfo } from '@/types'
import * as db from '@/providers/database-provider'

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
      state.chains = [action.payload, ...state.chains]
    })
    builder.addCase(deleteChain.fulfilled, (state, action) => {
      state.chains = action.payload
      if (state.currentChain && !state.chains.find((chain) => chain.id === state.currentChain?.id)) {
        state.currentChain = undefined
      }
    })
  }
})

export interface SaveChainRequest {
  chainId: string
  chainName: string
  rpcUrl: string
  faucetUrl?: string
}

export const saveChain = createAsyncThunk<NetworkMetainfo, SaveChainRequest, ThunkExtra>('chains/saveChain', async (chain, _) => {
  const data = await db.insertChain({
    chainId: chain.chainId,
    chainName: chain.chainName,
    rpcUrl: chain.rpcUrl,
    faucetUrl: chain.faucetUrl || '',
    active: false // new chains are not active by default
  })
  const savedChain = await db.getChainById(data.lastInsertRowId)
  if (!savedChain) {
    throw new Error('Failed to save chain')
  }
  console.log('Chain saved:', JSON.stringify(savedChain, null, 2))
  return savedChain
})

export const deleteChain = createAsyncThunk<NetworkMetainfo[], number, ThunkExtra>('chains/deleteChain', async (id, _) => {
  const res = await db.deleteChain(id)
  if (res.changes === 0) {
    throw new Error('No chain found with the given ID')
  }
  console.log('Chain deleted with ID:', id)
  return await db.listChains()
})

export const setCurrentChain = createAsyncThunk<NetworkMetainfo | undefined, NetworkMetainfo | undefined, ThunkExtra>(
  'chains/setCurrentChain',
  async (chain, thunkAPI) => {
    await db.updateActiveChain(chain?.id)
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    if (!chain) {
      console.warn('No chain provided to setCurrentChain, returning undefined')
      return undefined
    }
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

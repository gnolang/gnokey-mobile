import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GnoNativeApi } from "@gnolang/gnonative";
import { ThunkExtra } from "@/providers/redux-provider";
import { RootState } from "../root-reducer";
import { NetworkMetainfo } from "@/types";
import chains from '@/assets/chains.json'
import { createSelector } from "reselect";

export interface ChainsState {
  customChains: NetworkMetainfo[];
}

const initialState: ChainsState = {
  customChains: chains,
}

export const chainsSlice = createSlice({
  name: "chains",
  initialState,
  reducers: {
    addCustomChain: (state, action: PayloadAction<NetworkMetainfo>) => {
      state.customChains = state.customChains ? [...state.customChains, action.payload] : [action.payload];
    },
  },
  // selectors: {
  //   selectChainsAvailable: (state) => state.customChains ? (chains as NetworkMetainfo[]).concat(state.customChains) : chains,
  // },
})

export const getCurrentChain = createAsyncThunk<NetworkMetainfo | undefined, void, ThunkExtra>("user/getCurrentChain", async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const remote = await gnonative.getRemote();
  const combinedChains = selectChainsAvailable(thunkAPI.getState() as RootState);
  const currentChain = combinedChains.find((chain: NetworkMetainfo) => chain.gnoAddress === remote);
  if (!currentChain) {
    // chain not fuond can indicate some changed on gnoAddress. So, we need to update the current selection.
    // TODO: inform the user that the current chain is not available anymore.
    return undefined;
  }
  console.log("currentChain", currentChain);
  return currentChain;
})

const selectCustomOnly = (state: RootState) => state.chains.customChains;

export const selectChainsAvailable = createSelector([selectCustomOnly], (customChains) => {
  return (chains as NetworkMetainfo[]).concat(customChains);
})

// export const { selectChainsAvailable } = chainsSlice.selectors;
export const { addCustomChain } = chainsSlice.actions;
export const { } = chainsSlice.selectors;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectChainsAvailable } from "./signupSlice";
import { GnoNativeApi, KeyInfo } from "@gnolang/gnonative";
import { ThunkExtra } from "@/providers/redux-provider";
import { RootState } from "../root-reducer";

export interface VaultsState {
  vaults: KeyInfo[] | undefined;
  loading: boolean;
  error: Error | undefined;
}

const initialState: VaultsState = {
  vaults: undefined,
  loading: false,
  error: undefined,
};

/**
 * Fetch the vaults from the gnonative.
 * The vaults will be stored in the ´vaults´ state.
 */
export const fetchVaults = createAsyncThunk<KeyInfo[], void, ThunkExtra>("vaults/fetchVaults", async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const response = await gnonative.listKeyInfo();
  return response;
});

export const vaultsSlice = createSlice({
  name: "vaults",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVaults.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVaults.fulfilled, (state, action) => {
      state.loading = false;
      state.vaults = action.payload;
    });
    builder.addCase(fetchVaults.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error as Error;
    });
  },
  selectors: {
    selectVaults: (state) => state.vaults,
  },
});

export const { selectVaults } = vaultsSlice.selectors;

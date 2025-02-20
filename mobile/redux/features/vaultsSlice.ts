import { ThunkExtra } from "@/providers/redux-provider";
import { GnoNativeApi, KeyInfo } from "@gnolang/gnonative";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchVaults = createAsyncThunk<KeyInfo[], void, ThunkExtra>("vaults/fetchVaults", async (_, thunkAPI) => {

  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const response = await gnonative.listKeyInfo();
  return response;
});


export const vaultsSlice = createSlice({
  name: "vaults",
  initialState: {
    vaults: [],
    loading: false,
    error: null,
  },
  reducers: {
    setVaults: (state, action) => {
      state.vaults = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
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
      state.error = action.error;
    });
  }
});

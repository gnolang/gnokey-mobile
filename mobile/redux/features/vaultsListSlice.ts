import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GnoNativeApi, KeyInfo } from "@gnolang/gnonative";
import { ThunkExtra } from "@/providers/redux-provider";
import { RootState } from "../root-reducer";

export interface VaultsState {
  vaults?: KeyInfoBookmark[]; // will be overriden by the fetchVaults action. TODO: evict this field to be stored in redux.
  bookmarkedAddresses: string[];
  loading: boolean;
  error?: Error;
}

export type KeyInfoBookmark = {
  bookmarked?: boolean;
  keyInfo: KeyInfo;
}

const initialState: VaultsState = {
  vaults: undefined,
  bookmarkedAddresses: [],
  loading: false,
  error: undefined,
};

/**
 * Fetch the vaults from the gnonative.
 * The vaults will be stored in the ´vaults´ state.
 */
export const fetchVaults = createAsyncThunk<KeyInfoBookmark[], void, ThunkExtra>("vaults/fetchVaults", async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const keys = await gnonative.listKeyInfo();
  const bookmarks = selectBookmarkedAddresses(thunkAPI.getState() as RootState);

  const keysBooked: KeyInfoBookmark[] = keys.map((keyInfo) => {
    return { keyInfo, bookmarked: Boolean(bookmarks?.includes(String.fromCharCode(...keyInfo.address))) }
  });

  return keysBooked;
});

interface Prop {
  keyAddress: Uint8Array;
  value?: boolean;
}

export const vaultsSlice = createSlice({
  name: "vaults",
  initialState,
  reducers: {
    setBookmark: (state, action: PayloadAction<Prop>) => {
      const { keyAddress, value } = action.payload;
      const newaddr = String.fromCharCode(...keyAddress)

      if (value) {
        const exists = state.bookmarkedAddresses?.includes(newaddr);
        if (!exists) {
          state.bookmarkedAddresses = state.bookmarkedAddresses?.concat([newaddr])
        }
      } else {
        state.bookmarkedAddresses = state.bookmarkedAddresses?.filter((addr) => addr !== newaddr)
      }

      const vault = state.vaults?.find((keyInfo) => keyInfo.keyInfo.address.toString() === keyAddress.toString());
      if (vault) {
        vault.bookmarked = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVaults.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVaults.fulfilled, (state, action) => {
      state.loading = false;
      state.vaults = action.payload.sort((a, b) => {
        if ((a.bookmarked === b.bookmarked) || (a.bookmarked === undefined && b.bookmarked === undefined)) {
          return a.keyInfo.name.localeCompare(b.keyInfo.name);
        }
        return a.bookmarked ? 1 : -1;
      });
    });
    builder.addCase(fetchVaults.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error as Error;
    });
  },
  selectors: {
    selectVaults: (state) => state.vaults,
    selectBookmarkedAddresses: (state) => state.bookmarkedAddresses,
  },
});

export const { setBookmark } = vaultsSlice.actions;
export const { selectVaults, selectBookmarkedAddresses } = vaultsSlice.selectors;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GnoNativeApi, KeyInfo } from "@gnolang/gnonative";
import { ThunkExtra } from "@/providers/redux-provider";
import { RootState } from "../root-reducer";
import { selectChainsAvailable } from "./vaultAddSlice";
import { NetworkMetainfo } from "@/types";

export interface VaultListState {
  vaults?: KeyInfoBookmark[]; // will be overriden by the fetchVaults action. TODO: evict this field to be stored in redux.
  keyInfoChains?: Map<string, string[]>;
  bookmarkedAddresses: string[];
  loading: boolean;
  error?: Error;
}

export type KeyInfoBookmark = {
  bookmarked?: boolean;
  keyInfo: KeyInfo;
  chains?: string[];
}

const initialState: VaultListState = {
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

const hasCoins = async (gnonative: GnoNativeApi, address: Uint8Array) => {
  try {
    console.log("checking if user has balance");
    const balance = await gnonative.queryAccount(address);
    console.log("account balance: %s", balance.accountInfo?.coins);

    if (!balance.accountInfo) return false;

    const hasCoins = balance.accountInfo.coins.length > 0;
    const hasBalance = hasCoins && balance.accountInfo.coins[0].amount > 0;

    return hasBalance;
  } catch (error: any) {
    console.log("error on hasBalance", error["rawMessage"]);
    if (error["rawMessage"] === "invoke bridge method error: unknown: ErrUnknownAddress(#206)") return false;
    return false;
  }
};


type CheckOnChain = { keyInfoChains: Map<string, string[]> } | undefined;
/**
 * Check if each key is present in which chain.
 * */
export const checkForKeyOnChains = createAsyncThunk<CheckOnChain, void, ThunkExtra>("vault/checkForKeyOnChains", async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const vaults = await selectVaults(thunkAPI.getState() as RootState);
  const chains = await selectChainsAvailable(thunkAPI.getState() as RootState);

  const keyInfoChains = new Map<string, string[]>();

  if (!chains || !vaults) {
    return undefined;
  }

  for (const chain of chains) {
    console.log("checking keys on chain", chain.chainName);
    await gnonative.setChainID(chain.chainId);
    await gnonative.setRemote(chain.gnoAddress);

    for (const vault of vaults) {
      console.log(`Checking key ${vault.keyInfo.name} on chain ${chain.chainName}`);
      const keyHasCoins = await hasCoins(gnonative, vault.keyInfo.address);
      console.log(`Key ${vault.keyInfo.name} on chain ${chain.chainName} has coins: ${keyHasCoins}`);

      if (keyHasCoins) {
        keyInfoChains.has(vault.keyInfo.address.toString()) ? keyInfoChains.get(vault.keyInfo.address.toString())?.push(chain.chainName) : keyInfoChains.set(vault.keyInfo.address.toString(), [chain.chainName]);
      }
    }
  }
  return { keyInfoChains };
});

interface Prop {
  keyAddress: Uint8Array;
  value?: boolean;
}

export const vaultListSlice = createSlice({
  name: "vaultList",
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
        return a.bookmarked ? -1 : 1;
      });
    });
    builder.addCase(fetchVaults.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error as Error;
    });
    builder.addCase(checkForKeyOnChains.rejected, (state, action) => {
      console.error("checkForKeyOnChains.rejected", action.error);
    });
    builder.addCase(checkForKeyOnChains.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.keyInfoChains = action.payload.keyInfoChains;

      // update vaults with chains
      state.vaults?.forEach((vault) => {
        const chains = state.keyInfoChains?.get(vault.keyInfo.address.toString());
        if (chains) {
          vault.chains = chains;
        }
      });
    })
  },
  selectors: {
    selectVaults: (state) => state.vaults,
    selectBookmarkedAddresses: (state) => state.bookmarkedAddresses,
  },
});

export const { setBookmark } = vaultListSlice.actions;
export const { selectVaults, selectBookmarkedAddresses } = vaultListSlice.selectors;

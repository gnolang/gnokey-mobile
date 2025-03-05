import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectChainsAvailable } from "./vaultAddSlice";
import { GnoNativeApi, KeyInfo } from "@gnolang/gnonative";
import { ThunkExtra } from "@/providers/redux-provider";
import { RootState } from "../root-reducer";

export interface VaultEditState {
  vaultToEdit: KeyInfo | undefined;
  keyInfoChains?: Map<string, string[]>;
}

const initialState: VaultEditState = {
  vaultToEdit: undefined,
};

interface SaveChangesParam {
  newName: string;
}

interface DeleteVaultParam {
  vault: KeyInfo;
}

export const deleteVault = createAsyncThunk<boolean, DeleteVaultParam, ThunkExtra>("vault/deleteVault", async (param, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const { vault } = param;

  await gnonative.deleteAccount(vault.name, undefined, true);

  return true
})

export const saveChanges = createAsyncThunk<boolean, SaveChangesParam, ThunkExtra>("vault/saveChanges", async (param, thunkAPI) => {
  const { newName } = param;

  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;

  // TODO: Implement the save changes logic using the gnonative.

  return true;
});

/**
 * Check if each key is present in which chain.
 * */
export const checkForKeyOnChains = createAsyncThunk<Map<string, string[]>, void, ThunkExtra>("vault/checkForKeyOnChains", async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const keyinfos = await gnonative.listKeyInfo();
  const chains = await selectChainsAvailable(thunkAPI.getState() as RootState);

  const keyInfoChains = new Map<string, string[]>();

  for (const chain of chains) {
    console.log("checking keys on chain", chain.chainName);

    await gnonative.setChainID(chain.chainId);
    await gnonative.setRemote(chain.gnoAddress);

    for (const key of keyinfos) {
      console.log(`Checking key ${key.name} on chain ${chain.chainName}`);
      const keyHasCoins = await hasCoins(gnonative, key.address);
      console.log(`Key ${key.name} on chain ${chain.chainName} has coins: ${keyHasCoins}`);

      if (keyHasCoins) {
        console.log(`Key ${key.name} on chain ${chain.chainName} has coins`, JSON.stringify(key));
        keyInfoChains.has(key.address.toString()) ? keyInfoChains.get(key.address.toString())?.push(chain.chainName) : keyInfoChains.set(key.address.toString(), [chain.chainName]);
      }
    }
  }
  return keyInfoChains;
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

export const vaultEditSlice = createSlice({
  name: "vaultEdit",
  initialState,
  reducers: {
    setVaultToEdit: (state, action) => {
      state.vaultToEdit = action.payload.vault;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(checkForKeyOnChains.rejected, (state, action) => {
      console.error("checkForKeyOnChains.rejected", action.error);
    }),
      builder.addCase(checkForKeyOnChains.fulfilled, (state, action) => {
        console.log("checkForKeyOnChains.fulfilled", action.payload);
        state.keyInfoChains = action.payload;
      })
  },
  selectors: {
    selectVaultToEdit: (state) => state.vaultToEdit,
    selectKeyInfoChains: (state) => state.keyInfoChains,
  },
});

export const { setVaultToEdit } = vaultEditSlice.actions;

export const { selectVaultToEdit, selectKeyInfoChains } = vaultEditSlice.selectors;

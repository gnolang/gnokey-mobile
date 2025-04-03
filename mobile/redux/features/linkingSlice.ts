import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ThunkExtra } from "@/providers/redux-provider";
import { GnoNativeApi, KeyInfo, SignTxResponse } from "@gnolang/gnonative";
import * as Linking from "expo-linking";
import { RootState } from "../root-reducer";

const DEFAULT_GAS_MARGIN = 110; // 1.1%

export interface LinkingState {
  chainId?: string;
  remote?: string;
  clientName?: string;
  reason?: string;
  bech32Address?: string;
  /* The keyinfo of the selected account 'bech32Address' */
  keyinfo?: KeyInfo;
  txInput?: string;
  /* The callback URL to return to after each operation */
  callback?: string;
  /* The path of the requested screen */
  path?: string | "tosignin";
  hostname?: string;
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
};

/**
 * Send the address to the soliciting app
 */
export const sendAddressToSoliciting = createAsyncThunk<void, { keyInfo: KeyInfo }, ThunkExtra>(
  "linking/sendAddressToSoliciting",
  async ({ keyInfo }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
    const { callback } = (thunkAPI.getState() as RootState).linking;

    console.log("sendAddressToSoliciting", keyInfo, callback);

    if (!callback) {
      throw new Error("No callback found.");
    }

    const bech32 = await gnonative.addressToBech32(keyInfo?.address);

    Linking.openURL(callback + "?address=" + bech32 + "&cachekill=" + new Date().getTime());
  }
);

export const signTx = createAsyncThunk<SignTxResponse, { keyInfo: KeyInfo }, ThunkExtra>(
  "linking/signTx",
  async ({ keyInfo }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
    const { txInput } = (thunkAPI.getState() as RootState).linking;
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn;

    if (!masterPassword) {
      throw new Error("No keyInfo found.");
    }

    console.log("txInput", txInput);
    const txJson = decodeURIComponent(txInput || "");
    console.log("txJson", txJson);
    console.log("keyInfo", JSON.stringify(keyInfo));

    const res = await gnonative.activateAccount(keyInfo.name);
    console.log("activateAccount", res);

    await gnonative.setPassword(masterPassword, keyInfo.address);
    console.log("selected account", keyInfo.name);

    const signedTx = await gnonative.signTx(txJson, keyInfo?.address);
    console.log("signedTx", signedTx);

    return signedTx;
  }
);

interface gasEstimation {
  tx: string;
  gasWanted: bigint;
}

// estimateGasWanted estimates the gas wanted value for the transaction.
// If the `update` field is true, the transaction will be updated with the new gas wanted value.
export const estimateGasWanted = createAsyncThunk<gasEstimation, { keyInfo: KeyInfo; updateTx: boolean }, ThunkExtra>(
  "linking/estimateGas",
  async ({ keyInfo, updateTx }, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
    const { txInput } = (thunkAPI.getState() as RootState).linking;
    const { masterPassword } = (thunkAPI.getState() as RootState).signIn;

    if (!masterPassword) {
      throw new Error("No keyInfo found.");
    }

    const txJson = decodeURIComponent(txInput || "");

    await gnonative.activateAccount(keyInfo.name);
    await gnonative.setPassword(masterPassword, keyInfo.address);

    // Estimate the gas used
    const response = await gnonative.estimateGas(txJson, keyInfo?.address, DEFAULT_GAS_MARGIN, updateTx);
    const gasWanted = response.gasWanted as bigint;
    console.log("estimateGas: ", gasWanted);

    // Update the transaction
    if (updateTx) {
      return { tx: response.txJson, gasWanted: gasWanted };
    }

    return { tx: txJson, gasWanted };
  }
);

interface SetLinkResponse {
  chainId?: string;
  remote?: string;
  reason?: string;
  clientName?: string;
  bech32Address?: string;
  txInput?: string;
  callback?: string;
  path: string;
  keyinfo?: KeyInfo;
  hostname?: string;
}

export const setLinkingData = createAsyncThunk<SetLinkResponse, Linking.ParsedURL, ThunkExtra>(
  "linking/setLinkingData",
  async (parsedURL, thunkAPI) => {
    console.log("deep link received", parsedURL);

    const queryParams = parsedURL.queryParams;
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;

    const bech32Address = queryParams?.address ? (queryParams.address as string) : undefined;
    let keyinfo: KeyInfo | undefined;

    if (bech32Address) {
      const keyinfos = await gnonative.listKeyInfo();
      for (const k of keyinfos) {
        const kAddress = await gnonative.addressToBech32(k.address);
        if (kAddress === bech32Address) {
          keyinfo = k;
          break;
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
      path: (queryParams?.path as string) || "",
      keyinfo,
    };
  }
);

export const linkingSlice = createSlice({
  name: "linking",
  initialState,
  reducers: {
    clearLinking: (state) => {
      state = { ...initialState };
      state.hostname = undefined;
      state.txInput = undefined;
      state.callback = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setLinkingData.fulfilled, (state, action) => {
      state.chainId = action.payload.chainId;
      state.remote = action.payload.remote;
      state.reason = action.payload.reason;
      state.clientName = action.payload.clientName;
      state.bech32Address = action.payload.bech32Address;
      state.txInput = action.payload.txInput;
      state.callback = action.payload.callback;
      state.path = action.payload.path;
      state.keyinfo = action.payload.keyinfo;
      state.hostname = action.payload.hostname;
    });
    builder.addCase(estimateGasWanted.fulfilled, (state, action) => {
      state.txInput = action.payload.tx;
    });
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
  },
});

// Expo default hostname
const expo_default = "expo-development-client";

export const { clearLinking } = linkingSlice.actions;

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
} = linkingSlice.selectors;

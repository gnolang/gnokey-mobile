import { createAsyncThunk, createSlice, PayloadAction, RootState } from "@reduxjs/toolkit";
import { ThunkExtra } from "@/src/providers/redux-provider";
import { GnoNativeApi, KeyInfo, SignTxResponse } from "@gnolang/gnonative";
import * as Linking from 'expo-linking';

interface CounterState {
  clientName?: string;
  reason?: string;
  bech32Address?: string;
  /* The keyinfo of the selected account 'bech32Address' */
  keyinfo?: KeyInfo;
  txInput?: string;
  /* The callback URL to return to after each operation */
  callback?: string;
  /* The path of the requested screen */
  path?: string | 'tosignin';
  hostname?: string;
}

const initialState: CounterState = {
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
export const sendAddressToSoliciting = createAsyncThunk<void, { keyInfo: KeyInfo }, ThunkExtra>("linking/sendAddressToSoliciting", async ({ keyInfo }, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const { callback } = (thunkAPI.getState() as RootState).linking;

  console.log('sendAddressToSoliciting', keyInfo, callback);

  if (!callback) {
    throw new Error("No callback found.");
  }

  const bech32 = await gnonative.addressToBech32(keyInfo?.address);

  Linking.openURL(callback + '?address=' + bech32 + '&cachekill=' + new Date().getTime());
});

export const signTx = createAsyncThunk<SignTxResponse, { keyInfo: KeyInfo }, ThunkExtra>("linking/signTx", async ({ keyInfo }, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const { txInput } = (thunkAPI.getState() as RootState).linking;
  const { masterPassword } = (thunkAPI.getState() as RootState).signIn;

  if (!masterPassword) {
    throw new Error("No keyInfo found.");
  }

  const txJson = decodeURIComponent(txInput);
  console.log('txJson', txJson);
  console.log('keyInfo', JSON.stringify(keyInfo));

  const res = await gnonative.activateAccount(keyInfo.name);
  console.log('activateAccount', res);

  await gnonative.setPassword(masterPassword, keyInfo.address);
  console.log('selected account', keyInfo.name);

  const signedTx = await gnonative.signTx(txJson, keyInfo?.address);
  console.log('signedTx', signedTx);

  return signedTx
});

interface SetLinkResponse {
  reason?: string;
  clientName?: string;
  bech32Address?: string;
  txInput?: string;
  callback?: string;
  path: string;
  keyinfo?: KeyInfo;
  hostname?: string;
}

export const setLinkingData = createAsyncThunk<SetLinkResponse, Linking.ParsedURL, ThunkExtra>("linking/setLinkingData", async (parsedURL, thunkAPI) => {

  const queryParams = parsedURL.queryParams
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;

  const bech32Address = queryParams?.address ? queryParams.address as string : undefined;
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
    hostname: parsedURL.hostname || undefined,
    reason: queryParams?.reason ? queryParams.reason as string : undefined,
    clientName: queryParams?.client_name ? queryParams.client_name as string : undefined,
    bech32Address,
    txInput: queryParams?.tx ? queryParams.tx as string : undefined,
    callback: queryParams?.callback ? decodeURIComponent(queryParams.callback as string) : undefined,
    path: queryParams?.path as string || '',
    keyinfo
  }
});

export const linkingSlice = createSlice({
  name: "linking",
  initialState,
  reducers: {
    clearLinking: (state) => {
      console.log("clearing linking data");
      state = { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setLinkingData.fulfilled, (state, action) => {
      state.reason = action.payload.reason;
      state.clientName = action.payload.clientName;
      state.bech32Address = action.payload.bech32Address;
      state.txInput = action.payload.txInput;
      state.callback = action.payload.callback;
      state.path = action.payload.path;
      state.keyinfo = action.payload.keyinfo;
      state.hostname = action.payload.hostname;
    })
  },
  selectors: {
    selectTxInput: (state) => state.txInput,
    selectCallback: (state) => state.callback,
    selectPath: (state) => state.path,
    selectBech32Address: (state) => state.bech32Address,
    selectClientName: (state) => state.clientName,
    selectKeyInfo: (state) => state.keyinfo,
    reasonSelector: (state) => state.reason,
    isToSignInSelector: (state) => state.hostname === 'tosignin',
    selectAction: (state) => state.hostname !== expo_default ? state.hostname : undefined,
  },
});

// Expo default hostname
const expo_default = 'expo-development-client';

export const { clearLinking } = linkingSlice.actions;

export const { selectTxInput, selectCallback, selectPath, selectBech32Address, selectClientName, reasonSelector, selectKeyInfo, isToSignInSelector, selectAction } = linkingSlice.selectors;

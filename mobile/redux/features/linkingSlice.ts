import { createAsyncThunk, createSlice, PayloadAction, RootState } from "@reduxjs/toolkit";
import { ThunkExtra } from "@/src/providers/redux-provider";
import { GnoNativeApi, KeyInfo, SignTxResponse } from "@gnolang/gnonative";
import * as Linking from 'expo-linking';

interface CounterState {
  clientName?: string;
  reason?: string;
  bech32Address?: string;
  txInput?: string;
  /* The callback URL to return to after each operation */
  callback?: string;
  /* The path of the requested screen */
  path?: string | 'tologin';
}

const initialState: CounterState = {
  clientName: undefined,
  reason: undefined,
  bech32Address: undefined,
  txInput: undefined,
  callback: undefined,
  path: undefined,
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

export const linkingSlice = createSlice({
  name: "linking",
  initialState,
  reducers: {
    setLinkingData: (state, action: PayloadAction<Linking.ParsedURL>) => {
      const queryParams = action.payload.queryParams

      state.reason = queryParams?.reason ? queryParams.reason as string : undefined
      state.clientName = queryParams?.client_name ? queryParams.client_name as string : undefined
      state.bech32Address = queryParams?.address ? queryParams.address as string : undefined
      state.txInput = queryParams?.tx ? queryParams.tx as string : undefined
      state.callback = queryParams?.callback ? decodeURIComponent(queryParams.callback as string) : undefined
      state.path = queryParams?.path as string
    },
  },
  selectors: {
    selectTxInput: (state) => state.txInput,
    selectCallback: (state) => state.callback,
    selectPath: (state) => state.path,
    selectBech32Address: (state) => state.bech32Address,
    selectClientName: (state) => state.clientName,
    reasonSelector: (state) => state.reason,
  },
});

export const { setLinkingData } = linkingSlice.actions;

export const { selectTxInput, selectCallback, selectPath, selectBech32Address, selectClientName, reasonSelector } = linkingSlice.selectors;

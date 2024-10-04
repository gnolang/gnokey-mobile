import { createAsyncThunk, createSlice, PayloadAction, RootState } from "@reduxjs/toolkit";
import { ThunkExtra } from "@/src/providers/redux-provider";
import { ErrCode, GnoNativeApi, KeyInfo, SignTxResponse } from "@gnolang/gnonative";

interface CounterState {
  txInput?: string;
  /* The callback URL to return to after each operation */
  callback?: string;
}

const initialState: CounterState = {
  txInput: undefined,
  callback: undefined,
};

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
    setTxInput: (state, action: PayloadAction<{ txInput: string }>) => {
      state.txInput = action.payload.txInput;
    },
    setCallback: (state, action: PayloadAction<{ callback: string }>) => {
      state.callback = action.payload.callback;
    }
  },
  selectors: {
    selectTxInput: (state) => state.txInput,
    selectCallback: (state) => state.callback,
  },
});

export const { setTxInput, setCallback } = linkingSlice.actions;

export const { selectTxInput, selectCallback } = linkingSlice.selectors;

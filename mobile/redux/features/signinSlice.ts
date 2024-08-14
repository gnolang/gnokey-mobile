import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ThunkExtra } from "redux/redux-provider";
import * as SecureStore from 'expo-secure-store';

interface CounterState {
  masterPassword?: string;
  signedIn?: boolean;
  initialized?: boolean;
}

const initialState: CounterState = {
  masterPassword: undefined,
  signedIn: false,
  initialized: false,
};

interface SignInParam {
  masterPassword: string;
}

interface SignUpParam {
  masterPassword: string;
}

const MATER_PASS_KEY = "master_password_key_store";

export const signUp = createAsyncThunk<{ masterPassword: string | null }, SignUpParam, ThunkExtra>("signin/signup", async (param, config) => {
  const { masterPassword } = param;

  await SecureStore.setItemAsync(MATER_PASS_KEY, masterPassword);

  return { masterPassword }
})

export const signIn = createAsyncThunk<boolean, SignInParam, ThunkExtra>("signin/signin", async (param, config) => {
  const { masterPassword } = param;

  const storedPass = await SecureStore.getItemAsync(MATER_PASS_KEY);

  if (!storedPass) {
    throw new Error("No master password defined. Please create one.");
  }

  if (masterPassword !== storedPass) {
    throw new Error("Invalid password");
  }

  return true;
});

export const getInitialState = createAsyncThunk<{ masterPassword: string | null }, void>("signin/getInitialState", async () => {
  return {
    masterPassword: await SecureStore.getItemAsync(MATER_PASS_KEY),
  };
})

export const signinSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    signOut: (state) => {
      state.masterPassword = undefined;
      state.signedIn = false;
    },
  },

  extraReducers(builder) {
    builder.addCase(getInitialState.fulfilled, (state, action) => {
      state.masterPassword = action.payload.masterPassword ?? undefined;
      state.initialized = true;
    });
    builder.addCase(getInitialState.rejected, (_, action) => {
      console.error("getInitialState.rejected", action);
    });
    builder.addCase(signIn.fulfilled, (state) => {
      state.signedIn = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.masterPassword = action.payload.masterPassword ?? undefined;
    });
  },

  selectors: {
    selectMasterPassword: (state) => state.masterPassword,
    selectInitialized: (state) => state.initialized,
    selectSignedIn: (state) => state.signedIn,
  },
});

export const { signOut } = signinSlice.actions;

export const { selectInitialized, selectMasterPassword, selectSignedIn } = signinSlice.selectors;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ThunkExtra } from "@/src/providers/redux-provider";
import * as SecureStore from 'expo-secure-store';
import { ErrCode, GnoNativeApi, GRPCError } from "@gnolang/gnonative";

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

interface ChangeMasterParam {
  newPassword: string
  masterPassword: string
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

export const changeMasterPassword = createAsyncThunk<string, ChangeMasterParam, ThunkExtra>("user/changeMasterPass", async (param, config) => {
  const { newPassword, masterPassword } = param;

  const gnonative = config.extra.gnonative as GnoNativeApi;

  if (!newPassword) {
    throw new Error("newPassword is required.")
  }

  if (!masterPassword) {
    throw new Error("Master password not found.");
  }

  try {
    const response = await gnonative.listKeyInfo();

    if (response.length === 0) {
      throw new Error("No accounts found.");
    }

    for (const account of response) {
      console.log("change password for account", account);
      await gnonative.selectAccount(account.name);
      await gnonative.setPassword(masterPassword);
      await gnonative.updatePassword(newPassword, [account.address]);
    }

    console.log("done changing password for all accounts");
    // update the master password in the secure store
    await SecureStore.setItemAsync(MATER_PASS_KEY, newPassword);

    return newPassword

  } catch (error: any) {
    console.error(error);
    const err = new GRPCError(error);
    if (err.errCode() === ErrCode.ErrDecryptionFailed) {
      throw new Error("Wrong current master password.");
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
})

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
    builder.addCase(changeMasterPassword.fulfilled, (state, action) => {
      state.masterPassword = action.payload;
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

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "@/types";
import { ErrCode, GnoNativeApi, GRPCError, KeyInfo } from "@gnolang/gnonative";
import { ThunkExtra } from "redux/redux-provider";

export interface CounterState {
  account?: User;
}

const initialState: CounterState = {
  account: undefined,
};

interface LoginParam {
  keyInfo: KeyInfo;
}

interface ChangeMasterParam {
  newPassword: string
  masterPassword: string
}

export const loggedIn = createAsyncThunk<User, LoginParam, ThunkExtra>("user/loggedIn", async (param, config) => {
  const { keyInfo } = param;

  const gnonative = config.extra.gnonative as GnoNativeApi;

  const bech32 = await gnonative.addressToBech32(keyInfo.address);
  const user: User = { address: bech32, name: keyInfo.name };

  return user;
});

export const changeMasterPassword = createAsyncThunk<Boolean, ChangeMasterParam, ThunkExtra>("user/changeMasterPass", async (param, config) => {
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
      await gnonative.updatePassword(newPassword);
    }

    console.log("done changing password for all accounts");
    return true

  } catch (error: any) {
    console.error(error);
    const err = new GRPCError(error);
    if (err.errCode() === ErrCode.ErrDecryptionFailed) {
      throw new Error("Wrong current master password, please try again.");
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
})

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logedOut: (state) => {
      state.account = undefined;
    },
  },

  extraReducers(builder) {
    builder.addCase(loggedIn.fulfilled, (state, action) => {
      state.account = action.payload;
    });
    builder.addCase(loggedIn.rejected, (_, action) => {
      console.error("loggedIn.rejected", action);
    });
  },

  selectors: {
    selectAccount: (state) => state.account,
  },
});

export const { logedOut } = accountSlice.actions;

export const { selectAccount } = accountSlice.selectors;

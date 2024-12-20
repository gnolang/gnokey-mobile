import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GnoNativeApi, KeyInfo } from "@gnolang/gnonative";
import { createSelector } from 'reselect'
import { ThunkExtra } from "@/providers/redux-provider";
import { Alert } from "react-native";
import { NetworkMetainfo } from "@/types";
import { Coin } from '@buf/gnolang_gnonative.bufbuild_es/gnonativetypes_pb';
import chains from '@/assets/chains.json'
import { RootState } from "../root-reducer";

export enum SignUpState {
  user_exists_on_blockchain_and_local_storage = 'user_exists_on_blockchain_and_local_storage',
  user_exists_under_differente_key = 'user_exists_under_differente_key',
  user_exists_under_differente_key_local = 'user_exists_under_differente_key_local',
  user_exists_only_on_local_storage = 'user_exists_only_on_local_storage',
  user_already_exists_on_blockchain_under_different_name = 'user_already_exists_on_blockchain_under_different_name',
  user_already_exists_on_blockchain = 'user_already_exists_on_blockchain',
  account_created = 'account_created',
}

export interface SignupState {
  signUpState?: SignUpState
  newAccount?: KeyInfo;
  existingAccount?: KeyInfo;
  loading: boolean;
  progress: string[];
  customChains: NetworkMetainfo[];
  selectedChain?: NetworkMetainfo;
  registerAccount: boolean;
  keyName?: string;
  phrase?: string;
}

const initialState: SignupState = {
  signUpState: undefined,
  newAccount: undefined,
  existingAccount: undefined,
  loading: false,
  progress: [],
  customChains: [],
  selectedChain: undefined,
  registerAccount: false,
};

interface SignUpParam {
  name: string;
  password: string;
  phrase: string;
  captcha?: string;
}

type SignUpResponse = { newAccount?: KeyInfo, existingAccount?: KeyInfo, state: SignUpState };

/**
 * This thunk checks if the user is already registered on the blockchain and/or local storage.
 * The output is a state that will be used to decide the next step (signUpState).
 *
 * CASE 1.0: The user is: local storage (yes), blockchain (yes), under same name (yes) and address (yes), it will offer to do normal signin or choose new name.
 * CASE 1.1: The user is: local storage (yes), blockchain (yes), under same name (yes) and address (no),  it will offer to delete the local storage.
 * CASE 1.2: The user is: local storage (yes), blockchain (no),  under same name (---) and address (--),  it will offer to delete the local storage.
 *
 * CASE 2.0: The user is: local storage (no), blockchain (yes), under same name (no) and address (yes)
 * CASE 2.1: The user is: local storage (no), blockchain (yes), under same name (no) and address (no)
 *
 * CASE 3.0: The user is: local storage (no), blockchain (no), under same name (---) and address (--), it will proceed to create the account.
 *
 * ref: https://github.com/gnolang/dsocial/issues/72
 */
export const signUp = createAsyncThunk<SignUpResponse, SignUpParam, ThunkExtra>("user/signUp", async (param, thunkAPI) => {

  const { name, password, phrase, captcha } = param;
  const { registerAccount, selectedChain } = (thunkAPI.getState() as RootState).signUp;

  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;

  if (!selectedChain) {
    throw new Error("No chain selected");
  }

  // do not register on chain
  if (!registerAccount) {

    thunkAPI.dispatch(addProgress(`checking if "${name}" is already on local storage`))
    const userOnLocalStorage = await checkForUserOnLocalStorage(gnonative, name);
    thunkAPI.dispatch(addProgress(`response for "${name}": ${JSON.stringify(userOnLocalStorage)}`))

    if (userOnLocalStorage) {
      thunkAPI.dispatch(addProgress(`SignUpState.user_exists_under_differente_key_local`))
      // CASE 1.1: Bad case. Choose new name. (Delete name in keystore?)
      return { newAccount: undefined, state: SignUpState.user_exists_under_differente_key_local }
    }

    thunkAPI.dispatch(addProgress(`registerAccount is false`))
    const newAccount = await gnonative.createAccount(name, phrase, password);
    console.log("createAccount response: " + JSON.stringify(newAccount));

    if (!newAccount) {
      thunkAPI.dispatch(addProgress(`Failed to create account "${name}"`))
      throw new Error(`Failed to create account "${name}"`);
    }

    await gnonative.activateAccount(name);
    await gnonative.setPassword(password, newAccount.address);

    thunkAPI.dispatch(addProgress(`SignUpState.account_created`))
    return { newAccount, state: SignUpState.account_created };
  }

  thunkAPI.dispatch(addProgress(`checking if "${name}" is already registered on the blockchain.`))
  const blockchainUser = await checkForUserOnBlockchain(gnonative, name, phrase);
  thunkAPI.dispatch(addProgress(`response: "${JSON.stringify(blockchainUser)}"`))

  thunkAPI.dispatch(addProgress(`checking if "${name}" is already on local storage`))
  const userOnLocalStorage = await checkForUserOnLocalStorage(gnonative, name);
  thunkAPI.dispatch(addProgress(`response for "${name}": ${JSON.stringify(userOnLocalStorage)}`))

  if (userOnLocalStorage) {
    if (blockchainUser) {
      const localAddress = await gnonative.addressToBech32(userOnLocalStorage.address);
      thunkAPI.dispatch(addProgress(`exisging local address "${localAddress}" and blockchain Users Addr "${blockchainUser.address}"`))

      if (blockchainUser.address == localAddress) {
        thunkAPI.dispatch(addProgress(`CASE 1.0 SignUpState.user_exists_on_blockchain_and_local_storage`))
        // CASE 1.0: Offer to do normal signin, or choose new name
        return { newAccount: undefined, state: SignUpState.user_exists_on_blockchain_and_local_storage }

      }
      else {
        thunkAPI.dispatch(addProgress(`SignUpState.user_exists_under_differente_key`))
        // CASE 1.1: Bad case. Choose new name. (Delete name in keystore?)
        return { newAccount: undefined, state: SignUpState.user_exists_under_differente_key }
      }
    }
    else {
      thunkAPI.dispatch(addProgress(`SignUpState.user_exists_only_on_local_storage`))
      // CASE 1.2: Offer to onboard existing account, replace it, or choose new name
      return { newAccount: undefined, state: SignUpState.user_exists_only_on_local_storage, existingAccount: userOnLocalStorage }
    }
  } else {
    if (blockchainUser) {
      // This name is already registered on the blockchain.
      // CASE 2.0: Offer to rename keystoreInfoByAddr.name to name in keystore (password check), and do signin
      // CASE 2.1: "This name is already registered on the blockchain. Please choose another name."
      thunkAPI.dispatch(addProgress(blockchainUser.state))
      return { newAccount: undefined, state: blockchainUser.state }
    }

    // Proceed to create the account.
    // CASE 3.0: Proceed to create the account.
    const newAccount = await gnonative.createAccount(name, phrase, password);
    if (!newAccount) {
      thunkAPI.dispatch(addProgress(`Failed to create account "${name}"`))
      throw new Error(`Failed to create account "${name}"`);
    }

    console.log("createAccount response: " + JSON.stringify(newAccount));

    await gnonative.activateAccount(name);
    await gnonative.setPassword(password, newAccount.address);

    if (!selectedChain.faucetAddress) {
      thunkAPI.dispatch(addProgress(`no faucetAddress set for chain "${selectedChain.chainName}"`))
    } else {
      thunkAPI.dispatch(addProgress(`onboarding "${name}"`))
      await onboard(gnonative, newAccount, selectedChain.faucetAddress, captcha);
    }

    thunkAPI.dispatch(addProgress(`SignUpState.account_created`))
    return { newAccount, state: SignUpState.account_created };
  }
})

export const onboarding = createAsyncThunk<SignUpResponse, { account: KeyInfo, captcha?: string }, ThunkExtra>("user/onboarding", async (param, thunkAPI) => {
  thunkAPI.dispatch(addProgress(`onboarding "${param.account.name}"`))

  const { selectedChain } = (thunkAPI.getState() as RootState).signUp;

  if (!selectedChain) {
    throw new Error("No chain selected");
  }

  const { account, captcha } = param;
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  await onboard(gnonative, account, selectedChain.faucetAddress, captcha);

  thunkAPI.dispatch(addProgress(`SignUpState.account_created`))
  return { newAccount: account, state: SignUpState.account_created };
})

export const getCurrentChain = createAsyncThunk<NetworkMetainfo | undefined, void, ThunkExtra>("user/getCurrentChain", async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi;
  const remote = await gnonative.getRemote();
  const combinedChains = selectChainsAvailable(thunkAPI.getState() as RootState);
  const currentChain = combinedChains.find((chain: NetworkMetainfo) => chain.gnoAddress === remote);
  console.log("currentChain", currentChain);
  return currentChain;
})

export const initSignUpState = createAsyncThunk<{ phrase: string }, void, ThunkExtra>("user/initSignUpState", async (_, thunkAPI) => {

  let newPhrase = "";
  try {
    await thunkAPI.dispatch(getCurrentChain()).unwrap(); // to force update on redux store
    newPhrase = await (thunkAPI.extra.gnonative as GnoNativeApi).generateRecoveryPhrase()
  } catch (error) {
    console.error("error on qEval", error);
  }
  return { phrase: newPhrase };
})

const checkForUserOnLocalStorage = async (gnonative: GnoNativeApi, name: string): Promise<KeyInfo | undefined> => {
  let userOnLocalStorage: KeyInfo | undefined = undefined;
  try {
    userOnLocalStorage = await gnonative.getKeyInfoByNameOrAddress(name);
  } catch (e) {
    // TODO: Check for error other than ErrCryptoKeyNotFound(#151)
    return undefined;
  }
  return userOnLocalStorage
}

const checkForUserOnBlockchain = async (gnonative: GnoNativeApi, name: string, phrase: string): Promise<{ address: string, state: SignUpState } | undefined> => {
  let addressByName: string | undefined = undefined;
  const byNameStr = await gnonative.qEval("gno.land/r/demo/users", `GetUserByName("${name}")`);
  if (!byNameStr.startsWith("(nil")) {
    const addressByNameStr = await gnonative.qEval("gno.land/r/demo/users", `GetUserByName("${name}").Address.String()`);
    addressByName = convertToJson(addressByNameStr);
  }

  if (addressByName) {
    console.log("user %s already exists on the blockchain under the same name", name);
    return { address: addressByName, state: SignUpState.user_already_exists_on_blockchain };
  }

  try {
    const address = await gnonative.addressFromMnemonic(phrase);
    const addressBech32 = await gnonative.addressToBech32(address);
    console.log("addressBech32", addressBech32);

    const accountNameStr = await gnonative.qEval("gno.land/r/demo/users", `GetUserByAddress("${addressBech32}").Name`);
    console.log("GetUserByAddress result:", accountNameStr);
    const accountName = accountNameStr.match(/\("(\w+)"/)?.[1];
    console.log("GetUserByAddress after regex", accountName);

    if (accountName) {
      console.log("user KEY already exists on the blockchain under name %s", accountName);
      return { address: addressBech32, state: SignUpState.user_already_exists_on_blockchain_under_different_name };
    }

  } catch (error) {
    console.error("error on qEval", error);
    return undefined;
  }

  return undefined;
}

function convertToJson(result: string | undefined) {
  if (result === '("" string)') return undefined;

  if (!result || !(result.startsWith("(") && result.endsWith(" string)"))) throw new Error("Malformed GetThreadPosts response");
  const quoted = result.substring(1, result.length - " string)".length);
  const json = JSON.parse(quoted);

  return json;
}

const onboard = async (gnonative: GnoNativeApi, account: KeyInfo, faucetRemote?: string, captcha?: string) => {
  const { name, address } = account
  const address_bech32 = await gnonative.addressToBech32(address);
  console.log("onboard %s, with address: %s", name, address_bech32);

  try {
    const hasBalance = await hasCoins(gnonative, address);

    if (hasBalance) {
      console.log("user %s already has a balance", name);
      await registerAccount(gnonative, account);
      return;
    }

    if (faucetRemote) {
      const response = await sendCoins(address_bech32, faucetRemote, captcha);
      console.log("coins sent, response: %s", response);
      await registerAccount(gnonative, account);
    } else {
      console.log("no faucet remote address set");
    }

  } catch (error) {
    console.error("onboard error", error);
  }
};

const registerAccount = async (gnonative: GnoNativeApi, account: KeyInfo) => {
  console.log("Registering account %s", account.name);
  try {
    const gasFee = "10000000ugnot";
    const gasWanted = BigInt(20000000);
    const send = [new Coin({ denom: "ugnot", amount: BigInt(200000000) })];
    const args: Array<string> = ["", account.name, "Profile description"];
    for await (const response of await gnonative.call("gno.land/r/demo/users", "Register", args, gasFee, gasWanted, account.address, send)) {
      console.log("response: ", JSON.stringify(response));
    }
  } catch (error) {
    console.error("error registering account", error);
    Alert.alert("Error on registering account", "" + error);
  }
};

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

const sendCoins = async (address: string, faucetRemote: string, captcha?: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    To: address,
    captcha,
    amount: 1 * 1000000 + 'ugnot'
  });

  console.log("sending coins to %s", address);
  console.log("raw", raw);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    reactNative: { textStreaming: true },
  };

  // @ts-ignore
  if (!faucetRemote) {
    throw new Error("faucet remote address is undefined");
  }

  console.log("sending coins to %s on %s", address, faucetRemote);

  return fetch(faucetRemote, requestOptions);
};

export const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    signUpState: (state, action: PayloadAction<SignUpState>) => {
      state.signUpState = action.payload
    },
    addProgress: (state, action: PayloadAction<string>) => {
      console.log("progress--->", action.payload);
      state.progress = [...state.progress, '- ' + action.payload];
    },
    clearProgress: (state) => {
      state.progress = [];
    },
    addCustomChain: (state, action: PayloadAction<NetworkMetainfo>) => {
      state.customChains = state.customChains ? [...state.customChains, action.payload] : [action.payload];
    },
    setRegisterAccount: (state, action: PayloadAction<boolean>) => {
      state.registerAccount = action.payload;
    },
    setKeyName: (state, action: PayloadAction<string>) => {
      state.keyName = action.payload
    },
    setSelectedChain: (state, action: PayloadAction<NetworkMetainfo | undefined>) => {
      state.selectedChain = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(signUp.rejected, (state, action) => {
      action.error.message ? state.progress = [...state.progress, action.error.message] : null;
      console.error("signUp.rejected", action);
    }).addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.newAccount = action.payload?.newAccount;
      state.existingAccount = action.payload?.existingAccount;
      state.signUpState = action.payload?.state;
    }).addCase(onboarding.fulfilled, (state, action) => {
      state.loading = false;
      state.newAccount = action.payload?.newAccount;
      state.existingAccount = action.payload?.existingAccount;
      state.signUpState = action.payload?.state;
    }).addCase(initSignUpState.fulfilled, (state, action) => {
      console.log("initSignUpState.fulfilled", action.payload);
      state.phrase = action.payload.phrase;
      state.loading = false;
      state.newAccount = undefined;
      state.existingAccount = undefined;
      state.signUpState = undefined;
      state.keyName = "";
    }).addCase(getCurrentChain.fulfilled, (state, action) => {
      state.selectedChain = action.payload;
    })
  },

  selectors: {
    selectLoading: (state) => state.loading,
    selectProgress: (state) => state.progress,
    signUpStateSelector: (state) => state.signUpState,
    newAccountSelector: (state) => state.newAccount,
    existingAccountSelector: (state) => state.existingAccount,
    selectRegisterAccount: (state) => state.registerAccount,
    selectKeyName: (state) => state.keyName,
    selectSelectedChain: (state) => state.selectedChain,
    selectPhrase: (state) => state.phrase
  },
});

export const selectChainsAvailable = createSelector(
  (state: RootState) => state.signUp.customChains,
  (customChains) => customChains ? (chains as NetworkMetainfo[]).concat(customChains) : chains
);

export const { addProgress, signUpState, clearProgress, addCustomChain, setRegisterAccount, setKeyName,
  setSelectedChain
} = signUpSlice.actions;

export const { selectLoading, selectProgress, signUpStateSelector, newAccountSelector, existingAccountSelector,
  selectRegisterAccount, selectKeyName, selectSelectedChain, selectPhrase
} = signUpSlice.selectors;

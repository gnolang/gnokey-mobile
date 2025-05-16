import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CoinSchema, GnoNativeApi, KeyInfo } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'
import { Alert } from 'react-native'
import { NetworkMetainfo } from '@/types'
import { RootState } from '../root-reducer'
import { create } from '@bufbuild/protobuf'

export enum VaultCreationState {
  user_exists_on_blockchain_and_local_storage = 'user_exists_on_blockchain_and_local_storage',
  user_exists_under_differente_key = 'user_exists_under_differente_key',
  user_exists_under_differente_key_local = 'user_exists_under_differente_key_local',
  user_exists_only_on_local_storage = 'user_exists_only_on_local_storage',
  user_already_exists_on_blockchain_under_different_name = 'user_already_exists_on_blockchain_under_different_name',
  user_already_exists_on_blockchain = 'user_already_exists_on_blockchain',
  account_created = 'account_created'
}

export interface VaultAddState {
  signUpState?: VaultCreationState
  newAccount?: KeyInfo
  existingAccount?: KeyInfo
  loading: boolean
  progress: string[]
  selectedChain?: NetworkMetainfo
  registerAccount: boolean
  keyName?: string
  phrase?: string
}

const initialState: VaultAddState = {
  signUpState: undefined,
  newAccount: undefined,
  existingAccount: undefined,
  loading: false,
  progress: [],
  selectedChain: undefined,
  registerAccount: false
}

interface SignUpParam {
  name: string
  password: string
  phrase: string
}

type SignUpResponse = { newAccount?: KeyInfo; existingAccount?: KeyInfo; state: VaultCreationState }

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
export const addVault = createAsyncThunk<SignUpResponse, SignUpParam, ThunkExtra>('user/signUp', async (param, thunkAPI) => {
  const { name, password, phrase } = param
  const { selectedChain } = (thunkAPI.getState() as RootState).vaultAdd

  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

  console.log('selectedChain in signUp', selectedChain)

  if (selectedChain) {
    await gnonative.setRemote(selectedChain.gnoAddress)
    await gnonative.setChainID(selectedChain.chainId)
  }

  // do not register on chain
  if (!selectedChain) {
    thunkAPI.dispatch(addProgress(`checking if "${name}" is already on local storage`))
    const userOnLocalStorage = await checkForUserOnLocalStorage(gnonative, name)
    thunkAPI.dispatch(addProgress(`response for "${name}": ${JSON.stringify(userOnLocalStorage)}`))

    if (userOnLocalStorage) {
      thunkAPI.dispatch(addProgress(`SignUpState.user_exists_under_differente_key_local`))
      // CASE 1.1: Bad case. Choose new name. (Delete name in keystore?)
      return { newAccount: undefined, state: VaultCreationState.user_exists_under_differente_key_local }
    }

    thunkAPI.dispatch(addProgress(`registerAccount is false`))
    const newAccount = await gnonative.createAccount(name, phrase, password)
    console.log('createAccount response: ' + JSON.stringify(newAccount))

    if (!newAccount) {
      thunkAPI.dispatch(addProgress(`Failed to create account "${name}"`))
      throw new Error(`Failed to create account "${name}"`)
    }

    await gnonative.activateAccount(name)
    await gnonative.setPassword(password, newAccount.address)

    thunkAPI.dispatch(addProgress(`SignUpState.account_created`))
    return { newAccount, state: VaultCreationState.account_created }
  }

  thunkAPI.dispatch(addProgress(`checking if "${name}" is already registered on the blockchain.`))
  const blockchainUser = await checkForUserOnBlockchain(gnonative, name, phrase)
  thunkAPI.dispatch(addProgress(`response: "${JSON.stringify(blockchainUser)}"`))

  thunkAPI.dispatch(addProgress(`checking if "${name}" is already on local storage`))
  const userOnLocalStorage = await checkForUserOnLocalStorage(gnonative, name)
  thunkAPI.dispatch(addProgress(`response for "${name}": ${JSON.stringify(userOnLocalStorage)}`))

  if (userOnLocalStorage) {
    if (blockchainUser) {
      const localAddress = await gnonative.addressToBech32(userOnLocalStorage.address)
      thunkAPI.dispatch(
        addProgress(`exisging local address "${localAddress}" and blockchain Users Addr "${blockchainUser.address}"`)
      )

      if (blockchainUser.address === localAddress) {
        thunkAPI.dispatch(addProgress(`CASE 1.0 SignUpState.user_exists_on_blockchain_and_local_storage`))
        // CASE 1.0: Offer to do normal signin, or choose new name
        return { newAccount: undefined, state: VaultCreationState.user_exists_on_blockchain_and_local_storage }
      } else {
        thunkAPI.dispatch(addProgress(`SignUpState.user_exists_under_differente_key`))
        // CASE 1.1: Bad case. Choose new name. (Delete name in keystore?)
        return { newAccount: undefined, state: VaultCreationState.user_exists_under_differente_key }
      }
    } else {
      thunkAPI.dispatch(addProgress(`SignUpState.user_exists_only_on_local_storage`))
      // CASE 1.2: Offer to onboard existing account, replace it, or choose new name
      return {
        newAccount: undefined,
        state: VaultCreationState.user_exists_only_on_local_storage,
        existingAccount: userOnLocalStorage
      }
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
    const newAccount = await gnonative.createAccount(name, phrase, password)
    if (!newAccount) {
      thunkAPI.dispatch(addProgress(`Failed to create account "${name}"`))
      throw new Error(`Failed to create account "${name}"`)
    }

    console.log('createAccount response: ' + JSON.stringify(newAccount))

    await gnonative.activateAccount(name)
    await gnonative.setPassword(password, newAccount.address)

    if (!selectedChain.faucetAddress) {
      thunkAPI.dispatch(addProgress(`no faucetAddress set for chain "${selectedChain.chainName}"`))
    } else {
      thunkAPI.dispatch(addProgress(`onboarding "${name}"`))
      await onboard(gnonative, newAccount, selectedChain.faucetAddress)
    }

    thunkAPI.dispatch(addProgress(`SignUpState.account_created`))
    return { newAccount, state: VaultCreationState.account_created }
  }
})

export const onboarding = createAsyncThunk<SignUpResponse, { account: KeyInfo }, ThunkExtra>(
  'user/onboarding',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(addProgress(`onboarding "${param.account.name}"`))

    const { selectedChain } = (thunkAPI.getState() as RootState).vaultAdd

    if (!selectedChain) {
      throw new Error('No chain selected')
    }

    const { account } = param
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    await onboard(gnonative, account, selectedChain.faucetAddress)

    thunkAPI.dispatch(addProgress(`SignUpState.account_created`))
    return { newAccount: account, state: VaultCreationState.account_created }
  }
)

export const generateNewPhrase = createAsyncThunk<{ phrase: string }, void, ThunkExtra>(
  'user/generateNewPhrase',
  async (_, thunkAPI) => {
    let newPhrase = ''
    try {
      newPhrase = await (thunkAPI.extra.gnonative as GnoNativeApi).generateRecoveryPhrase()
    } catch (error) {
      console.error('error on qEval', error)
    }
    return { phrase: newPhrase }
  }
)

const checkForUserOnLocalStorage = async (gnonative: GnoNativeApi, name: string): Promise<KeyInfo | undefined> => {
  let userOnLocalStorage: KeyInfo | undefined = undefined
  try {
    userOnLocalStorage = await gnonative.getKeyInfoByNameOrAddress(name)
  } catch {
    // TODO: Check for error other than ErrCryptoKeyNotFound(#151)
    return undefined
  }
  return userOnLocalStorage
}

const checkForUserOnBlockchain = async (
  gnonative: GnoNativeApi,
  name: string,
  phrase: string
): Promise<{ address: string; state: VaultCreationState } | undefined> => {
  let addressByName: string | undefined = undefined
  const byNameStr = await gnonative.qEval('gno.land/r/sys/users', `ResolveName("${name}")`)
  if (!byNameStr.startsWith('(nil')) {
    const addressByNameStr = await gnonative.qEval('gno.land/r/sys/users', `ResolveName("${name}")`)
    addressByName = convertToJson(addressByNameStr)
  }

  if (addressByName) {
    console.log('user %s already exists on the blockchain under the same name', name)
    return { address: addressByName, state: VaultCreationState.user_already_exists_on_blockchain }
  }

  try {
    const address = await gnonative.addressFromMnemonic(phrase)
    const addressBech32 = await gnonative.addressToBech32(address)
    console.log('addressBech32', addressBech32)

    const accountNameStr = await gnonative.qEval('gno.land/r/sys/users', `ResolveAddress("${addressBech32}")`)
    console.log('GetUserByAddress result:', accountNameStr)
    const accountName = accountNameStr.match(/\("(\w+)"/)?.[1]
    console.log('GetUserByAddress after regex', accountName)

    if (accountName) {
      console.log('user KEY already exists on the blockchain under name %s', accountName)
      return { address: addressBech32, state: VaultCreationState.user_already_exists_on_blockchain_under_different_name }
    }
  } catch (error) {
    console.error('error on qEval', error)
    return undefined
  }

  return undefined
}

function convertToJson(result: string | undefined) {
  if (!result || result === '("" string)') return undefined

  const userData = result.match(/\("(\w+)" std\.Address/)?.[1]
  if (!userData) throw new Error('Malformed response')
  return userData
}

const onboard = async (gnonative: GnoNativeApi, account: KeyInfo, faucetRemote?: string) => {
  const { name, address } = account
  const address_bech32 = await gnonative.addressToBech32(address)
  console.log('onboarding %s, with address: %s', name, address_bech32)

  try {
    const hasBalance = await hasCoins(gnonative, address)

    if (hasBalance) {
      console.log('user %s already has a balance', name)
      await registerAccount(gnonative, account)
      return
    }

    if (faucetRemote) {
      const response = await sendCoins(address_bech32, faucetRemote)
      console.log('coins sent, response: %s', response)
      await registerAccount(gnonative, account)
    } else {
      console.log('no faucet remote address set')
    }
  } catch (error) {
    console.error('onboard error', error)
  }
}

const registerAccount = async (gnonative: GnoNativeApi, account: KeyInfo) => {
  console.log('Registering account %s', account.name)
  try {
    const gasFee = '10000000ugnot'
    const gasWanted = BigInt(20000000)
    const send = [create(CoinSchema, { denom: 'ugnot', amount: BigInt(1000000) })]
    const args: string[] = [account.name]
    for await (const response of await gnonative.call(
      'gno.land/r/gnoland/users/v1',
      'Register',
      args,
      gasFee,
      gasWanted,
      account.address,
      send
    )) {
      console.log('response: ', JSON.stringify(response))
    }
  } catch (error) {
    console.error('error registering account', error)
    Alert.alert('Error on registering account', '' + error)
  }
}

const hasCoins = async (gnonative: GnoNativeApi, address: Uint8Array) => {
  try {
    console.log('checking if user has balance')
    const balance = await gnonative.queryAccount(address)
    console.log('account balance: %s', balance.accountInfo?.coins)

    if (!balance.accountInfo) return false

    const hasCoins = balance.accountInfo.coins.length > 0
    const hasBalance = hasCoins && balance.accountInfo.coins[0].amount > 0

    return hasBalance
  } catch (error: any) {
    console.log('error on hasBalance', error['rawMessage'])
    if (error['rawMessage'] === 'invoke bridge method error: unknown: ErrUnknownAddress(#206)') return false
    return false
  }
}

const sendCoins = async (address: string, faucetRemote: string) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    To: address
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    reactNative: { textStreaming: true }
  }

  // @ts-ignore
  if (!faucetRemote) {
    throw new Error('faucet remote address is undefined')
  }

  console.log('sending coins to %s on %s', address, faucetRemote)

  return fetch(faucetRemote, requestOptions)
}

export const vaultAddSlice = createSlice({
  name: 'vaultAdd',
  initialState,
  reducers: {
    signUpState: (state, action: PayloadAction<VaultCreationState>) => {
      state.signUpState = action.payload
    },
    addProgress: (state, action: PayloadAction<string>) => {
      console.log('progress--->', action.payload)
      state.progress = [...state.progress, '- ' + action.payload]
    },
    clearProgress: (state) => {
      state.progress = []
    },
    setRegisterAccount: (state, action: PayloadAction<boolean>) => {
      state.registerAccount = action.payload
    },
    setKeyName: (state, action: PayloadAction<string>) => {
      state.keyName = action.payload
    },
    setSelectedChain: (state, action: PayloadAction<NetworkMetainfo | undefined>) => {
      state.selectedChain = action.payload
    },
    resetState: (state) => {
      state.loading = false
      state.newAccount = undefined
      state.existingAccount = undefined
      state.signUpState = undefined
      state.selectedChain = undefined
      state.keyName = ''
    }
  },
  extraReducers(builder) {
    builder
      .addCase(addVault.rejected, (state, action) => {
        if (action.error.message) {
          state.progress = [...state.progress, action.error.message]
        }
        console.error('signUp.rejected', action)
      })
      .addCase(addVault.fulfilled, (state, action) => {
        state.loading = false
        state.newAccount = action.payload?.newAccount
        state.existingAccount = action.payload?.existingAccount
        state.signUpState = action.payload?.state
      })
      .addCase(onboarding.fulfilled, (state, action) => {
        state.loading = false
        state.newAccount = action.payload?.newAccount
        state.existingAccount = action.payload?.existingAccount
        state.signUpState = action.payload?.state
      })
      .addCase(generateNewPhrase.fulfilled, (state, action) => {
        state.phrase = action.payload.phrase
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
  }
})

export const { addProgress, signUpState, clearProgress, setRegisterAccount, setKeyName, setSelectedChain, resetState } =
  vaultAddSlice.actions

export const {
  selectLoading,
  selectProgress,
  signUpStateSelector,
  newAccountSelector,
  existingAccountSelector,
  selectRegisterAccount,
  selectKeyName,
  selectSelectedChain,
  selectPhrase
} = vaultAddSlice.selectors

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { enableBiometric } from '@/redux'
import { ThunkExtra } from '@/providers/redux-provider'
import * as SecureStore from 'expo-secure-store'
import { ErrCode, GnoNativeApi, GRPCError } from '@gnolang/gnonative'
import { MATER_PASS_KEY } from './constants'
import { Alert } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

export interface SignInState {
  masterPassword?: string
  signedIn?: boolean
  initialized?: boolean
}

const initialState: SignInState = {
  masterPassword: undefined,
  signedIn: false,
  initialized: false
}

export const signinSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    signOut: (state) => {
      state.signedIn = false
    }
  },

  extraReducers(builder) {
    builder.addCase(getInitialState.fulfilled, (state, action) => {
      state.masterPassword = action.payload.masterPassword ?? undefined
      state.initialized = true
    })
    builder.addCase(getInitialState.rejected, (_, action) => {
      console.error('getInitialState.rejected', action)
    })
    builder.addCase(doSignIn.fulfilled, (state, action) => {
      state.signedIn = action.payload
    })
    builder.addCase(createMasterPass.fulfilled, (state, action) => {
      state.masterPassword = action.payload.masterPassword ?? undefined
      state.signedIn = true
    })
    builder.addCase(changeMasterPassword.fulfilled, (state, action) => {
      state.masterPassword = action.payload
    })
  },

  selectors: {
    selectMasterPassword: (state) => state.masterPassword,
    selectInitialized: (state) => state.initialized,
    selectSignedIn: (state) => state.signedIn
  }
})

export const { signOut } = signinSlice.actions

export const { selectInitialized, selectMasterPassword, selectSignedIn } = signinSlice.selectors

interface CreateMasterParam {
  masterPassword: string
}

export const createMasterPass = createAsyncThunk<{ masterPassword: string | null }, CreateMasterParam, ThunkExtra>(
  'signin/createMasterPass',
  async (param) => {
    const { masterPassword } = param

    await SecureStore.setItemAsync(MATER_PASS_KEY, masterPassword)

    return { masterPassword }
  }
)

export interface DoSignInParam {
  masterPassword: string
  isBiometric?: boolean
}

export const doSignIn = createAsyncThunk<boolean, DoSignInParam, ThunkExtra>('signin/doSignIn', async (param, thunkAPI) => {
  const { masterPassword, isBiometric } = param

  if (isBiometric) {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        'Biometric Authentication Not Available',
        'Please ensure your device has biometric hardware and you have enrolled at least one biometric credential.'
      )
      return false
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock with Face ID',
      fallbackLabel: 'Use Passcode'
    })

    if (result.success) {
      console.log('Biometric authentication successful, retrieved password')
      return true
    } else {
      console.log('Biometric authentication failed', result.error)
      if (result.error === 'user_cancel') {
        thunkAPI.dispatch(enableBiometric(false))
      }
      return false
    }
  }

  const storedPass = await SecureStore.getItemAsync(MATER_PASS_KEY)

  if (!storedPass) {
    throw new Error('No master password defined. Please create one.')
  }

  if (masterPassword !== storedPass) {
    throw new Error('Invalid password')
  }

  return true
})

interface ChangeMasterParam {
  newPassword: string
  masterPassword: string
}

export const changeMasterPassword = createAsyncThunk<string, ChangeMasterParam, ThunkExtra>(
  'user/changeMasterPass',
  async (param, config) => {
    const { newPassword, masterPassword } = param

    const gnonative = config.extra.gnonative as GnoNativeApi

    if (!newPassword) {
      throw new Error('newPassword is required.')
    }

    if (!masterPassword) {
      throw new Error('Master password not found.')
    }

    try {
      const response = await gnonative.listKeyInfo()

      if (response.length === 0) {
        throw new Error('No accounts found.')
      }

      for (const account of response) {
        console.log('change password for account', account)
        await gnonative.activateAccount(account.name)
        console.log('activated account', account)
        await gnonative.setPassword(masterPassword, account.address)
        console.log('set password for account', account)
        await gnonative.rotatePassword(newPassword, [account.address])
        console.log('updated password for account', account)
      }

      console.log('done changing password for all accounts')
      // update the master password in the secure store
      await SecureStore.setItemAsync(MATER_PASS_KEY, newPassword)

      return newPassword
    } catch (error: any) {
      console.error(error)
      const err = new GRPCError(error)
      if (err.errCode() === ErrCode.ErrDecryptionFailed) {
        throw new Error('Wrong current master password.')
      } else {
        throw new Error(JSON.stringify(error))
      }
    }
  }
)

export const getInitialState = createAsyncThunk<{ masterPassword: string | null }, void>('signin/getInitialState', async () => {
  return {
    masterPassword: await SecureStore.getItemAsync(MATER_PASS_KEY)
  }
})

export const doBiometricAuth = createAsyncThunk<void, void, ThunkExtra>('signin/doBiometricAuth', async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()

  if (!hasHardware || !isEnrolled) {
    Alert.alert(
      'Biometric Authentication Not Available',
      'Please ensure your device has biometric hardware and you have enrolled at least one biometric credential.'
    )
    return
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock with Face ID',
    fallbackLabel: 'Use Passcode'
  })

  if (result.success) {
    const p = await SecureStore.getItemAsync(MATER_PASS_KEY)
    console.log('Biometric authentication successful, retrieved password:', p)
    // setPassword(p!)
    // onUnlokPress(p!)
  } else {
    console.log('Biometric authentication failed')
  }
})

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import * as SecureStore from 'expo-secure-store'
import { GnoNativeApi } from '@gnolang/gnonative'
import { initDatabase, nukeDatabase } from '@/providers/database-provider'
import { BIOMETRIC_ENABLED_KEY, DEV_MODE_KEY, MATER_PASS_KEY } from './constants'
import * as LocalAuthentication from 'expo-local-authentication'
import { Alert } from 'react-native'

const initialState: SettingsState = {
  loading: false,
  isDevMode: SecureStore.getItem(DEV_MODE_KEY) === 'true',
  isBiometricEnabled: SecureStore.getItem(BIOMETRIC_ENABLED_KEY) === 'true'
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(hardReset.pending, (state) => {
      state.loading = true
    })
    builder.addCase(hardReset.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(hardReset.rejected, (state, err) => {
      console.log(err)
      state.loading = false
    })
    builder.addCase(toggleDevMode.fulfilled, (state, action) => {
      state.isDevMode = action.payload
    })
    builder.addCase(toggleDevMode.rejected, (state, err) => {
      console.log(err)
      state.isDevMode = SecureStore.getItem(DEV_MODE_KEY) === 'true'
    })
    builder.addCase(enableBiometric.fulfilled, (state, action) => {
      state.isBiometricEnabled = action.payload
    })
  },
  selectors: {
    selectLoadingReset: (state) => state.loading,
    selectDevMode: (state) => state.isDevMode,
    selectBiometricEnabled: (state) => state.isBiometricEnabled
  }
})

export const { selectLoadingReset, selectDevMode, selectBiometricEnabled } = settingsSlice.selectors

export interface SettingsState {
  loading: boolean
  isDevMode: boolean
  isBiometricEnabled: boolean
}

export const hardReset = createAsyncThunk<boolean, void, ThunkExtra>('settings/hardReset', async (param, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

  const keys = await gnonative.listKeyInfo()
  for (const key of keys) {
    await gnonative.deleteAccount(key.name, undefined, true)
  }
  await nukeDatabase()
  await initDatabase()
  if (await SecureStore.getItem(MATER_PASS_KEY)) {
    await SecureStore.deleteItemAsync(MATER_PASS_KEY)
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY)
    await SecureStore.deleteItemAsync(DEV_MODE_KEY)
  }
  await new Promise((r) => setTimeout(r, 2000))
  return true
})

export const toggleDevMode = createAsyncThunk<boolean, void, ThunkExtra>('settings/toggleDevMode', async () => {
  const currentMode = SecureStore.getItem(DEV_MODE_KEY)
  const newMode = currentMode !== 'true' ? 'true' : 'false'
  SecureStore.setItem(DEV_MODE_KEY, newMode)
  return newMode === 'true'
})

export const enableBiometric = createAsyncThunk<boolean, boolean, ThunkExtra>(
  'settings/enableBiometric',
  async (enabled, thunkAPI) => {
    if (enabled) {
      if (!LocalAuthentication.hasHardwareAsync()) {
        Alert.alert('Biometric Authentication Not Available', 'This device does not support biometric authentication.')
        return false
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!isEnrolled) {
        Alert.alert(
          'Biometric Authentication Not Enrolled',
          'Please enroll at least one biometric credential (Face ID, Touch ID, etc.) in your device settings.'
        )
        return false
      }

      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Biometric Authentication',
        fallbackLabel: 'Use Passcode'
      })

      if (res.success) {
        await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true')
        Alert.alert('Success', 'Biometric authentication has been enabled.')
        return true
      } else {
        throw new Error('Failed to enable biometric authentication. Please try again.')
      }
    } else {
      await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY)
      Alert.alert('Done', 'Biometric authentication has been disabled. You can re-enable it later in settings.')
      return false
    }
  }
)

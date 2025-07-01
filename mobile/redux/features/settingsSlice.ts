import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import * as SecureStore from 'expo-secure-store'
import { GnoNativeApi } from '@gnolang/gnonative'
import { nukeDatabase } from '@/providers/database-provider'
import { DEV_MODE_KEY, MATER_PASS_KEY } from './constants'

const initialState: SettingsState = {
  loading: false,
  forceAppReset: false,
  devMode: SecureStore.getItem(DEV_MODE_KEY) === 'true'
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
      state.forceAppReset = true
    })
    builder.addCase(hardReset.rejected, (state, err) => {
      console.log(err)
      state.loading = false
    })
    builder.addCase(toggleDevMode.fulfilled, (state, action) => {
      state.devMode = action.payload
    })
    builder.addCase(toggleDevMode.rejected, (state, err) => {
      console.log(err)
      state.devMode = SecureStore.getItem(DEV_MODE_KEY) === 'true'
    })
  },
  selectors: {
    selectLoadingReset: (state) => state.loading,
    selectForceAppReset: (state) => state.forceAppReset,
    selectDevMode: (state) => state.devMode
  }
})

export const { selectLoadingReset, selectForceAppReset, selectDevMode } = settingsSlice.selectors

export interface SettingsState {
  loading: boolean
  forceAppReset: boolean
  devMode: boolean
}

export const hardReset = createAsyncThunk<boolean, void, ThunkExtra>('settings/hardReset', async (param, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

  const keys = await gnonative.listKeyInfo()
  for (const key of keys) {
    await gnonative.deleteAccount(key.name, undefined, true)
  }
  await nukeDatabase()
  if (await SecureStore.getItem(MATER_PASS_KEY)) {
    await SecureStore.deleteItemAsync(MATER_PASS_KEY)
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

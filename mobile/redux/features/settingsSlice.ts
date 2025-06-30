import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import * as SecureStore from 'expo-secure-store'
import { GnoNativeApi } from '@gnolang/gnonative'
import { nukeDatabase } from '@/providers/database-provider'
import { MATER_PASS_KEY } from './signinSlice'

const initialState: SettingsState = {
  loading: false,
  forceAppReset: false
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
  },
  selectors: {
    selectLoadingReset: (state) => state.loading,
    selectForceAppReset: (state) => state.forceAppReset
  }
})

export const { selectLoadingReset, selectForceAppReset } = settingsSlice.selectors

export interface SettingsState {
  loading: boolean
  forceAppReset: boolean
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

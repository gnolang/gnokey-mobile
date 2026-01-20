import { createAsyncThunk, createSelector, createSlice, RootState } from '@reduxjs/toolkit'
import { GnoNativeApi } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'
import { Vault } from '@/types'
import * as DB from '@/providers/database-provider'

export interface VaultEditState {
  vaultToEdit: Vault | undefined
}

const initialState: VaultEditState = {
  vaultToEdit: undefined
}

export const vaultEditSlice = createSlice({
  name: 'vaultEdit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setVaultToEdit.fulfilled, (state, action) => {
      state.vaultToEdit = action.payload
    })
  },
  selectors: {
    selectVaultToEdit: (state) => state.vaultToEdit
  }
})

export const setVaultToEdit = createAsyncThunk<Vault, Vault, ThunkExtra>('vault/setVaultToEdit', async (vault, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
  await gnonative.activateAccount(vault.address)
  return vault
})

interface DeleteVaultParam {
  vault: Vault
}

export const deleteVault = createAsyncThunk<boolean, DeleteVaultParam, ThunkExtra>(
  'vault/deleteVault',
  async (param, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    const { vault } = param

    await gnonative.deleteAccount(vault.keyInfo.name, undefined, true)
    await DB.deleteVault(vault.id)

    return true
  }
)

interface UpdateVaultParam {
  vault: Vault
  keyName: string
  description: string
}

export const updateVault = createAsyncThunk<boolean, UpdateVaultParam, ThunkExtra>(
  'vault/updateVault',
  async (params, thunkAPI) => {
    const { vault, keyName, description } = params
    await DB.updateVault(vault, keyName, description)
    // const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    // await gnonative.updateAccount(vault.keyInfo.name, vault.keyName, vault.description)
    return true
  }
)

export const { selectVaultToEdit } = vaultEditSlice.selectors

export const selectVaultToEditWithBalance = createSelector(
  [(state: RootState) => state.vaultEdit.vaultToEdit, (state: RootState) => state.vaultBalance],
  (vault, balances) => {
    if (!vault) return undefined
    return {
      ...vault,
      balance: vault && vault.keyInfo ? (balances[vault.keyInfo.address.toString()] ?? 0n) : 0n
    }
  }
)

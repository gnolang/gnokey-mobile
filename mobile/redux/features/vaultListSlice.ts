import { createAsyncThunk, createSelector, createSlice, PayloadAction, RootState } from '@reduxjs/toolkit'
import { GnoNativeApi, KeyInfo } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'
import { Vault } from '@/types'
import { listVaultsByChain } from '@/providers/database-provider'
import { selectCurrentChain } from '@/redux'

export interface VaultListState {
  /** vaults fetched from gnonative */
  vaults?: Vault[]

  /** chains where the vaults have coins */
  vaultsChains?: Map<vaultAddress, vaultChains>

  loading: boolean

  error?: Error
}

type vaultAddress = string
type vaultChains = string[]

const initialState: VaultListState = {
  vaults: undefined,
  loading: false,
  error: undefined
}

/**
 * Fetch the vaults from the gnonative.
 * The vaults will be stored in the ´vaults´ state.
 */
export const fetchVaults = createAsyncThunk<Vault[], void, ThunkExtra>('vaults/fetchVaults', async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
  const currentChain = selectCurrentChain(thunkAPI.getState() as RootState)
  const keyinfoList = await gnonative.listKeyInfo()
  const databaseVaults = await listVaultsByChain(currentChain?.id || undefined)

  return enrichData(keyinfoList, databaseVaults)
})

const enrichData = (keyinfoList: KeyInfo[], databaseVaults: Vault[]) => {
  if (!keyinfoList) return []

  const data = databaseVaults.map((vault) => {
    const keyInfo = keyinfoList.find((k) => k.name === vault.keyName)
    if (!keyInfo) {
      console.warn(`KeyInfo not found for vault: ${vault.keyInfo.name}`)
      return vault
    }
    return {
      ...vault,
      keyInfo,
      bookmarked: vault.bookmarked || false,
      chains: [] as string[] // Initialize chains as empty array
    } as Vault
  })
  // console.log('enriched data:', JSON.stringify(data, null, 2))
  return data
}

interface Prop {
  keyAddress: Uint8Array
  value?: boolean
}

export const vaultListSlice = createSlice({
  name: 'vaultList',
  initialState,
  reducers: {
    setBookmark: (state, action: PayloadAction<Prop>) => {
      // TODO: implement bookmark logic
      console.log('setBookmark', action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVaults.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchVaults.fulfilled, (state, action) => {
      state.loading = false
      state.vaults = action.payload.sort((a, b) => {
        if (a.bookmarked === b.bookmarked || (a.bookmarked === undefined && b.bookmarked === undefined)) {
          return a.keyInfo.name.localeCompare(b.keyInfo.name)
        }
        return a.bookmarked ? -1 : 1
      })
    })
    builder.addCase(fetchVaults.rejected, (state, action) => {
      state.loading = false
      state.error = action.error as Error
    })
  },
  selectors: {
    selectVaults: (state) => state.vaults
  }
})

export const { setBookmark } = vaultListSlice.actions
export const { selectVaults } = vaultListSlice.selectors

export const selectVaultsWithBalances = createSelector(
  [(state: RootState) => state.vaultList.vaults, (state: RootState) => state.vaultBalance],
  (vaults, balances) => {
    if (!vaults) return []

    return vaults?.map((vault: Vault) => {
      return {
        ...vault,
        balance: vault && vault.keyInfo ? (balances[vault.keyInfo.address.toString()] ?? 0n) : 0n
      } as Vault
    })
  }
)

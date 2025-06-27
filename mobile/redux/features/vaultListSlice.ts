import { createAsyncThunk, createSlice, PayloadAction, RootState } from '@reduxjs/toolkit'
import { GnoNativeApi, KeyInfo } from '@gnolang/gnonative'
import { ThunkExtra } from '@/providers/redux-provider'

export interface VaultListState {
  /** vaults fetched from gnonative */
  vaults?: Vault[]

  /** chains where the vaults have coins */
  vaultsChains?: Map<vaultAddress, vaultChains>

  /** addresses of the vaults that are bookmarked */
  bookmarkedAddresses: string[]

  loading: boolean

  error?: Error
}

type vaultAddress = string
type vaultChains = string[]

export type Vault = {
  bookmarked?: boolean
  keyInfo: KeyInfo
  chains?: string[]
}

const initialState: VaultListState = {
  vaults: undefined,
  bookmarkedAddresses: [],
  loading: false,
  error: undefined
}

/**
 * Fetch the vaults from the gnonative.
 * The vaults will be stored in the ´vaults´ state.
 */
export const fetchVaults = createAsyncThunk<Vault[], void, ThunkExtra>('vaults/fetchVaults', async (_, thunkAPI) => {
  const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
  const bookmarks = selectBookmarkedAddresses(thunkAPI.getState() as RootState)
  const vaultsChains = selectVaultsChains(thunkAPI.getState() as RootState)
  const keyinfoList = await gnonative.listKeyInfo()

  return enrichData(keyinfoList, bookmarks, vaultsChains)
})

const enrichData = (keyinfoList: KeyInfo[], bookmarks: string[], vaultsChains?: Map<vaultAddress, vaultChains>) => {
  if (!keyinfoList || !bookmarks) return []

  return keyinfoList.map((keyInfo) => ({
    keyInfo,
    bookmarked: Boolean(bookmarks?.includes(String.fromCharCode(...keyInfo.address))),
    chains: vaultsChains instanceof Map ? vaultsChains.get(keyInfo.address.toString()) : []
  })) as Vault[]
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

type CheckOnChain = { infoOnChains: Map<vaultAddress, vaultChains> } | undefined
/**
 * Check if each key is present in which chain.
 * */
export const checkForKeyOnChains = createAsyncThunk<CheckOnChain, void, ThunkExtra>(
  'vault/checkForKeyOnChains',
  async (_, thunkAPI) => {
    if (true) return undefined
    // const gnonative = thunkAPI.extra.gnonative as GnoNativeApi
    // const vaults = await selectVaults(thunkAPI.getState() as RootState)
    // const chains = await selectChainsAvailable(thunkAPI.getState() as RootState)

    // const infoOnChains = new Map<string, string[]>()

    // if (!chains || !vaults) {
    //   return undefined
    // }

    // for (const chain of chains) {
    //   console.log('checking keys on chain', chain.chainName)
    //   await gnonative.setChainID(chain.chainId)
    //   await gnonative.setRemote(chain.rpcUrl)

    //   for (const vault of vaults) {
    //     console.log(`Checking key ${vault.keyInfo.name} on chain ${chain.chainName}`)
    //     const keyHasCoins = await hasCoins(gnonative, vault.keyInfo.address)
    //     console.log(`Key ${vault.keyInfo.name} on chain ${chain.chainName} has coins: ${keyHasCoins}`)

    //     if (keyHasCoins) {
    //       if (infoOnChains.has(vault.keyInfo.address.toString())) {
    //         infoOnChains.get(vault.keyInfo.address.toString())?.push(chain.chainName)
    //       } else {
    //         infoOnChains.set(vault.keyInfo.address.toString(), [chain.chainName])
    //       }
    //     }
    //   }
    // }
    // return { infoOnChains }
  }
)

interface Prop {
  keyAddress: Uint8Array
  value?: boolean
}

export const vaultListSlice = createSlice({
  name: 'vaultList',
  initialState,
  reducers: {
    setBookmark: (state, action: PayloadAction<Prop>) => {
      const { keyAddress, value } = action.payload
      const newaddr = String.fromCharCode(...keyAddress)

      if (value) {
        const exists = state.bookmarkedAddresses?.includes(newaddr)
        if (!exists) {
          state.bookmarkedAddresses = state.bookmarkedAddresses?.concat([newaddr])
        }
      } else {
        state.bookmarkedAddresses = state.bookmarkedAddresses?.filter((addr) => addr !== newaddr)
      }

      const vault = state.vaults?.find((keyInfo) => keyInfo.keyInfo.address.toString() === keyAddress.toString())
      if (vault) {
        vault.bookmarked = value
      }
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
    builder.addCase(checkForKeyOnChains.rejected, (state, action) => {
      console.error('checkForKeyOnChains.rejected', action.error)
    })
    builder.addCase(checkForKeyOnChains.fulfilled, (state, action) => {
      if (!action.payload) return
      state.vaultsChains = action.payload.infoOnChains

      // update vaults with chains
      state.vaults?.forEach((vault) => {
        const chains = state.vaultsChains?.get(vault.keyInfo.address.toString())
        if (chains) {
          vault.chains = chains
        } else {
          vault.chains = []
        }
      })
    })
  },
  selectors: {
    selectVaults: (state) => state.vaults,
    selectVaultsChains: (state) => state.vaultsChains,
    selectChainsPerVault: (state) => (address: string) => state.vaultsChains?.get(address),
    selectBookmarkedAddresses: (state) => state.bookmarkedAddresses
  }
})

export const { setBookmark } = vaultListSlice.actions
export const { selectVaults, selectBookmarkedAddresses, selectVaultsChains, selectChainsPerVault } = vaultListSlice.selectors

import { createAsyncThunk, createSlice, PayloadAction, RootState } from '@reduxjs/toolkit'
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
  const databaseVaults = await listVaultsByChain(currentChain?.chainId || '')

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

// const hasCoins = async (gnonative: GnoNativeApi, address: Uint8Array) => {
//   try {
//     console.log('checking if user has balance')
//     const balance = await gnonative.queryAccount(address)
//     console.log('account balance: %s', balance.accountInfo?.coins)

//     if (!balance.accountInfo) return false

//     const hasCoins = balance.accountInfo.coins.length > 0
//     const hasBalance = hasCoins && balance.accountInfo.coins[0].amount > 0

//     return hasBalance
//   } catch (error: any) {
//     console.log('error on hasBalance', error['rawMessage'])
//     if (error['rawMessage'] === 'invoke bridge method error: unknown: ErrUnknownAddress(#206)') return false
//     return false
//   }
// }

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
    selectVaults: (state) => state.vaults
  }
})

export const { setBookmark } = vaultListSlice.actions
export const { selectVaults } = vaultListSlice.selectors

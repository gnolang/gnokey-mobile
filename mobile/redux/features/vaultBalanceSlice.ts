import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GnoNativeApi } from '@gnolang/gnonative'
import { RootState } from '@/redux'
import { ThunkExtra } from '@/providers/redux-provider'
import { Vault } from '@/types'

export type BalanceState = { [address: string]: bigint }

const initialState: BalanceState = {}

export const vaultBalanceSlice = createSlice({
  name: 'vaultBalance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBalances.fulfilled, (state, action) => {
      console.log('selectVaultsWithBalances xx:', action.payload)
      Object.assign(state, action.payload)
    })
  }
})

export const fetchBalances = createAsyncThunk<{ [address: string]: bigint }, Vault[], ThunkExtra>(
  'balances/fetchBalances',
  async (vaults, thunkAPI) => {
    const gnonative = thunkAPI.extra.gnonative as GnoNativeApi

    const balanceEntries = await Promise.all(
      vaults.map(async (vault) => {
        const balance = await getBalance(gnonative, vault.keyInfo.address)
        return [vault.keyInfo.address.toString(), balance] as [string, bigint]
      })
    )
    return Object.fromEntries(balanceEntries)
  }
)

const getBalance = async (gnonative: GnoNativeApi, address: Uint8Array) => {
  try {
    console.log('fetching balance for address:', address)
    const balance = await gnonative.queryAccount(address)
    console.log('account balance: %s', balance.accountInfo?.coins)

    if (!balance.accountInfo) return 0n

    const hasCoins = balance.accountInfo.coins.length > 0
    const amount = hasCoins ? balance.accountInfo.coins[0].amount : 0n

    return amount
  } catch (error: any) {
    console.log('error on getBalance', error['rawMessage'])
    if (error['rawMessage'] === 'invoke bridge method error: unknown: ErrUnknownAddress(#206)') return 0n
    return 0n
  }
}

export const selectBalance = (state: RootState, address: Uint8Array) => state.vaultBalance[address.toString()]

export default vaultBalanceSlice.reducer

// type CheckOnChain = { infoOnChains: Map<vaultAddress, vaultChains> } | undefined
/**
 * Check if each key is present in which chain.
 * */
// export const checkForKeyOnChains = createAsyncThunk<CheckOnChain, void, ThunkExtra>(
//   'vault/checkForKeyOnChains',
//   async (_, thunkAPI) => {
//     if (true) return undefined
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
//   }
// )

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

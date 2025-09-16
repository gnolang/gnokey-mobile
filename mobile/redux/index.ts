import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import {
  vaultEditSlice,
  signinSlice,
  vaultAddSlice,
  linkingSlice,
  VaultEditState,
  VaultAddState,
  SignInState,
  vaultListSlice,
  VaultListState,
  ChainsState,
  chainsSlice,
  sessionKeySlice,
  LinkingState,
  SessionKeyState,
  settingsSlice,
  SettingsState,
  vaultBalanceSlice
} from '@/redux/features'
import { BalanceState, combineSlices, configureStore } from '@reduxjs/toolkit'

export const rootReducer = combineSlices({
  [vaultAddSlice.name]: vaultAddSlice.reducer,
  [vaultEditSlice.name]: vaultEditSlice.reducer,
  [vaultListSlice.name]: vaultListSlice.reducer,
  [signinSlice.name]: signinSlice.reducer,
  [linkingSlice.name]: linkingSlice.reducer,
  [chainsSlice.name]: chainsSlice.reducer,
  [sessionKeySlice.name]: sessionKeySlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [vaultBalanceSlice.name]: vaultBalanceSlice.reducer
})

export type RootState = {
  vaultAdd: VaultAddState
  vaultEdit: VaultEditState
  vaultList: VaultListState
  signIn: SignInState
  linking: LinkingState
  chains: ChainsState
  sessionKey: SessionKeyState
  settings: SettingsState
  vaultBalance: BalanceState
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Create a temporary store to infer the dispatch type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export * from './features'

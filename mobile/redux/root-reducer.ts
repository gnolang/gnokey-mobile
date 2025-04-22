import { combineSlices, configureStore, LinkingState, SessionKeyState } from '@reduxjs/toolkit'
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
  txSlice,
  TxState
} from '@/redux/features'

const rootReducer = combineSlices({
  [vaultAddSlice.name]: vaultAddSlice.reducer,
  [vaultEditSlice.name]: vaultEditSlice.reducer,
  [vaultListSlice.name]: vaultListSlice.reducer,
  [signinSlice.name]: signinSlice.reducer,
  [linkingSlice.name]: linkingSlice.reducer,
  [chainsSlice.name]: chainsSlice.reducer,
  [sessionKeySlice.name]: sessionKeySlice.reducer,
  [txSlice.name]: txSlice.reducer
})

export type RootState = {
  vaultAdd: VaultAddState
  vaultEdit: VaultEditState
  vaultList: VaultListState
  signIn: SignInState
  linking: LinkingState
  chains: ChainsState
  sessionKey: SessionKeyState
  tx: TxState
}

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch

export default rootReducer

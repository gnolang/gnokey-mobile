import { combineSlices, configureStore, LinkingState } from "@reduxjs/toolkit";
import { vaultSlice, signinSlice, signUpSlice, linkingSlice, VaultState, SignupState, SignInState, vaultsSlice, VaultsState } from "@/redux/features";

const rootReducer = combineSlices({
  [vaultSlice.reducerPath]: vaultSlice.reducer,
  [signUpSlice.reducerPath]: signUpSlice.reducer,
  [signinSlice.reducerPath]: signinSlice.reducer,
  [linkingSlice.reducerPath]: linkingSlice.reducer,
  [vaultsSlice.reducerPath]: vaultsSlice.reducer,
});

export type RootState = {
  vault: VaultState;
  vaults: VaultsState;
  signIn: SignInState;
  signUp: SignupState;
  linking: LinkingState;
};

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch

export default rootReducer;

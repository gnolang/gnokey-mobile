import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { vaultSlice, signinSlice, signUpSlice, linkingSlice, VaultState, SignupState, SignInState } from "@/redux/features";

const rootReducer = combineSlices({
  [vaultSlice.reducerPath]: vaultSlice.reducer,
  [signUpSlice.reducerPath]: signUpSlice.reducer,
  [signinSlice.reducerPath]: signinSlice.reducer,
  [linkingSlice.reducerPath]: linkingSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export default rootReducer;

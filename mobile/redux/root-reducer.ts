import { combineSlices, configureStore, LinkingState } from "@reduxjs/toolkit";
import { vaultSlice, signinSlice, signUpSlice, linkingSlice, VaultEditState, SignupState, SignInState } from "@/redux/features";

const rootReducer = combineSlices({
    [vaultSlice.reducerPath]: vaultSlice.reducer,
    [signUpSlice.reducerPath]: signUpSlice.reducer,
    [signinSlice.reducerPath]: signinSlice.reducer,
    [linkingSlice.reducerPath]: linkingSlice.reducer,
});

export type RootState = {
    vault: VaultEditState;
    signIn: SignInState;
    signUp: SignupState;
    linking: LinkingState;
};

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch

export default rootReducer;
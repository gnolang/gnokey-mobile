import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vaultSlice, signinSlice, linkingSlice } from "@/redux/features";
import { GnoNativeApi, useGnoNativeContext } from "@gnolang/gnonative";
import { signUpSlice } from "@/redux/features/signupSlice";
import { useSearch, UseSearchReturnType } from "@/src/hooks/use-search";

interface Props {
  children: React.ReactNode;
}

export interface ThunkExtra {
  extra: { gnonative: GnoNativeApi; search: UseSearchReturnType };
}

export const reducer = {
  [vaultSlice.reducerPath]: vaultSlice.reducer,
  [signUpSlice.reducerPath]: signUpSlice.reducer,
  [signinSlice.reducerPath]: signinSlice.reducer,
  [linkingSlice.reducerPath]: linkingSlice.reducer,
}

const ReduxProvider: React.FC<Props> = ({ children }) => {
  // Exposing GnoNative API to reduxjs/toolkit
  const { gnonative } = useGnoNativeContext();
  const search = useSearch();

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,

        thunk: {
          // To make Thunk inject gnonative in all Thunk objects.
          // https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments
          extraArgument: {
            gnonative,
            search,
          },
        },
      }),
  });

  return <Provider store={store}>{children}</Provider>;
};

export { ReduxProvider };

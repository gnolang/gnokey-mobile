import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vaultSlice, signinSlice, linkingSlice } from "@/redux/features";
import { GnoNativeApi, useGnoNativeContext } from "@gnolang/gnonative";
import { signUpSlice } from "@/redux/features/signupSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

interface Props {
  children: React.ReactNode;
}

export interface ThunkExtra {
  extra: { gnonative: GnoNativeApi };
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

export const reducer = {
  [vaultSlice.reducerPath]: vaultSlice.reducer,
  [signUpSlice.reducerPath]: signUpSlice.reducer,
  [signinSlice.reducerPath]: signinSlice.reducer,
  [linkingSlice.reducerPath]: linkingSlice.reducer,
}

const persistedReducer = persistReducer(persistConfig, reducer)

const ReduxProvider: React.FC<Props> = ({ children }) => {
  // Exposing GnoNative API to reduxjs/toolkit
  const { gnonative } = useGnoNativeContext();

  // const store = configureStore({
  //   reducer,
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware({
  //       serializableCheck: false,

  //       thunk: {
  //         // To make Thunk inject gnonative in all Thunk objects.
  //         // https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments
  //         extraArgument: {
  //           gnonative
  //         },
  //       },
  //     }),
  // });

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        thunk: {
          // To make Thunk inject gnonative in all Thunk objects.
          // https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments
          extraArgument: {
            gnonative
          },
        },
      }),
  })

  let persistor = persistStore(store)

  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>;
};

export { ReduxProvider };

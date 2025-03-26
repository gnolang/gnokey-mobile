import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { GnoNativeApi, useGnoNativeContext } from "@gnolang/gnonative";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  Persistor,
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import rootReducer from "@/redux/root-reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  children: React.ReactNode;
}

export interface ThunkExtra {
  extra: { gnonative: GnoNativeApi };
}

const persistConfig = {
  key: 'root-9',
  version: 5,
  storage: AsyncStorage,
}

let persistor:Persistor

// TODO: serialize the Uint8Array
const persistedReducer = persistReducer(persistConfig, rootReducer)

const ReduxProvider: React.FC<Props> = ({ children }) => {
  // Exposing GnoNative API to reduxjs/toolkit
  const { gnonative } = useGnoNativeContext();

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: {
          // To make Thunk inject gnonative in all Thunk objects.
          // https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments
          extraArgument: {
            gnonative
          },
        },
      }),
  })

  persistor = persistStore(store)

  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>;
};

export { ReduxProvider, persistor };

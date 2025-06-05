import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { GnoNativeApi, useGnoNativeContext } from '@gnolang/gnonative'
import rootReducer from '@/redux/root-reducer'
interface Props {
  children: React.ReactNode
}
export interface ThunkExtra {
  extra: { gnonative: GnoNativeApi }
}

const ReduxProvider: React.FC<Props> = ({ children }) => {
  // Exposing GnoNative API to reduxjs/toolkit
  const { gnonative } = useGnoNativeContext()

  const store = useMemo(
    () =>
      configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: false,
            thunk: {
              // To make Thunk inject gnonative in all Thunk objects.
              // https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments
              extraArgument: {
                gnonative
              }
            }
          })
      }),
    [gnonative]
  )

  return <Provider store={store}>{children}</Provider>
}

export { ReduxProvider }

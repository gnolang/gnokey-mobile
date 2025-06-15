import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { GnoNativeApi, useGnoNativeContext } from '@gnolang/gnonative'
import { rootReducer } from '@/redux'
import { useDatabaseContext } from './database-provider'

interface Props {
  children: React.ReactNode
}
export interface ThunkExtra {
  extra: { gnonative: GnoNativeApi }
}

const ReduxProvider: React.FC<Props> = ({ children }) => {
  // Exposing GnoNative API to reduxjs/toolkit
  const { gnonative } = useGnoNativeContext()
  const { listChains } = useDatabaseContext()
  const [store, setStore] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      if (store) return // Prevent re-initialization
      const chains = await listChains()

      gnonative.setChainID(chains.currentChain.chainId)
      gnonative.setRemote(chains.currentChain.rpcUrl)

      const storeInstance = configureStore({
        reducer: rootReducer,
        preloadedState: {
          chains: {
            chains: chains.chains,
            currentChain: chains.currentChain
          }
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: false,
            thunk: {
              extraArgument: { gnonative }
            }
          })
      })
      setStore(storeInstance)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!store) return null

  return <Provider store={store}>{children}</Provider>
}

export { ReduxProvider }

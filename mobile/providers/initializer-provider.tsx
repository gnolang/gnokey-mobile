import { useGnoNativeContext } from '@gnolang/gnonative'
import { useAppDispatch, setSelectedChain } from '@/redux'
import { useFocusEffect } from 'expo-router'
import React, { useCallback } from 'react'
import defaultChains from '@/assets/chains.json'

export const Initializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { gnonative } = useGnoNativeContext()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState(true)

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        try {
          // const remote = await gnonative.getRemote()
          const chainId = await gnonative.getChainID()
          const chain = defaultChains.find((x) => x.chainId === chainId)
          if (!chain) {
            throw new Error(`Chain with ID ${chainId} not found in default chains`)
          }
          dispatch(setSelectedChain(chain))
          setLoading(false)
        } catch (error) {
          console.error('GnoNative initialization failed:', error)
        }
      })()

      return () => {
        // Cleanup logic if needed when the app loses focus
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  if (loading) {
    return null // or a loading spinner
  }

  return children
}

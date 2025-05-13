import { useEffect } from 'react'
import * as Linking from 'expo-linking'
import { useAppDispatch, setLinkingData } from '@/redux'

const LinkingProvider = ({ children }: { children: React.ReactNode }) => {
  const url = Linking.useURL()
  const dispatch = useAppDispatch()

  // This hook will be called whenever we receive a new URL from the linking event
  useEffect(() => {
    ;(async () => {
      if (url) {
        dispatch(setLinkingData({ url }))
      }
    })()
  }, [url, dispatch])

  return <>{children}</>
}

export { LinkingProvider }

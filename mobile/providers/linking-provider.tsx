import { useAppDispatch } from '@/redux'
import { setLinkingData } from '@/redux/features/linkingSlice'
import * as Linking from 'expo-linking'
import { useEffect } from 'react'

const LinkingProvider = ({ children }: { children: React.ReactNode }) => {
  const url = Linking.useLinkingURL()

  const dispatch = useAppDispatch()

  // This hook will be called whenever we receive a new URL from the linking event
  useEffect(() => {
    ;(async () => {
      if (url) {
        const linkingParsedURL = Linking.parse(url)

        // console.log('link url', url) // the full URL
        // console.log('link hostname', linkingParsedURL.hostname) // (tosignin | tosign )
        // console.log('link path', linkingParsedURL.path)
        // console.log('link queryParams', linkingParsedURL.queryParams) // address, remote, chain_id, client_name, callback

        dispatch(setLinkingData(linkingParsedURL))
      }
    })()
  }, [url, dispatch])

  return <>{children}</>
}

export { LinkingProvider }

import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { getInitialState, selectInitialized, selectMasterPassword, useAppDispatch, useAppSelector, selectSignedIn } from '@/redux'
import { multiply } from '@gnokeymobile/ui'

export default function Root() {
  const dispatch = useAppDispatch()
  const route = useRouter()
  const appInitialized = useAppSelector(selectInitialized)
  const hasMasterPassword = useAppSelector(selectMasterPassword)
  const signedIn = useAppSelector(selectSignedIn)
  const result = multiply(3, 7)
  console.log('Multiply result:', result)

  useEffect(() => {
    dispatch(getInitialState())
  }, [dispatch])

  useEffect(() => {
    if (appInitialized) {
      console.log('App initialized:', { signedIn })
      if (!hasMasterPassword) {
        console.log('No master password set, redirecting to onboarding')
        route.replace('/onboarding')
      } else if (signedIn) {
        console.log('User is signed in, redirecting to home')
        route.replace('/home')
      } else {
        console.log('User not signed in, redirecting to welcome')
        route.replace('/welcome')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInitialized, signedIn, hasMasterPassword])

  return null
}

import React from 'react'
import { useRouter, useSegments } from 'expo-router'
import { selectSignedIn, useAppSelector } from '@/redux'
import { Loading } from '../loading'

interface PropsWithChildren {
  children: React.ReactNode
}

export function Guard(props: PropsWithChildren) {
  const signedIn = useAppSelector(selectSignedIn)
  const segments = useSegments()
  const router = useRouter()

  React.useEffect(() => {
    console.log('Guard: ', signedIn, segments)
    // @ts-ignore
    const inAuthGroup = segments.length === 0 || segments[0] === 'sign-up' || segments[0] === 'sign-in'

    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!signedIn && !inAuthGroup) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, segments])

  if (signedIn === undefined) return <Loading message="Loading..." />

  return props.children
}

import React from 'react'
import { useRouter, useSegments } from 'expo-router'
import { selectSignedIn, useAppSelector } from '@/redux'
import { SharedSegment } from 'app/(app)/home/_layout'

interface PropsWithChildren {
  children: React.ReactNode
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(signedIn?: boolean) {
  const segments = useSegments()
  const router = useRouter()
  const [segment] = useSegments() as [SharedSegment]

  React.useEffect(() => {
    const inAuthGroup = segments.length == 0 || segments[0] === 'sign-up' || segments[0] == 'sign-in'

    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!signedIn && !inAuthGroup) {
      router.replace('/')
    }
  }, [signedIn, segments])
}

export function Guard(props: PropsWithChildren) {
  const signedIn = useAppSelector(selectSignedIn)

  useProtectedRoute(signedIn)

  return props.children
}

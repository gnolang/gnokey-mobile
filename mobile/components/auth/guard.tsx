import React from 'react'
import { useRouter, useSegments } from 'expo-router'
import { selectSignedIn, useAppSelector } from '@/redux'

interface PropsWithChildren {
  children: React.ReactNode
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(signedIn?: boolean) {
  const segments = useSegments()
  const router = useRouter()

  const unauthSegments = ['sign-up', 'sign-in', 'forgot-pass']

  React.useEffect(() => {
    // @ts-ignore
    const inAuthGroup = segments.length === 0 || unauthSegments.includes(segments[0])

    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!signedIn && !inAuthGroup) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, segments])
}

export function Guard(props: PropsWithChildren) {
  const signedIn = useAppSelector(selectSignedIn)

  useProtectedRoute(signedIn)

  return props.children
}

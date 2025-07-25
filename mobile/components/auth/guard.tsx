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

  const unauthSegments = ['sign-up', 'sign-in', 'forgot-pass', 'onboarding', 'welcome']

  React.useEffect(() => {
    // @ts-ignore
    // console.log('useProtectedRoute', { segments })
    const inAuthGroup =
      !segments[0] || // root path
      segments.includes('onboarding') || // allow any route with 'onboarding' in the path
      segments.some((seg) => unauthSegments.includes(seg))

    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!signedIn && !inAuthGroup) {
      console.log('User not signed <guard>', segments)
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

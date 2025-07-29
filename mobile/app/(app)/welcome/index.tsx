import { useState } from 'react'
import { useRouter } from 'expo-router'
import { BetaVersionBanner } from '@/components/index'
import { selectAction, useAppDispatch, useAppSelector, doSignIn } from '@/redux'
import { OnboardingLayout, WelcomeBack, WelcomeBackFooter } from '@/modules/ui-components'
import { WelcomeBackError } from '@/modules/ui-components/organisms/WelcomeBackError'

export default function Root() {
  const [error, setError] = useState<string | undefined>(undefined)
  const route = useRouter()
  const dispatch = useAppDispatch()
  const action = useAppSelector(selectAction)

  const onUnlockPress = async (masterPassword: string, isBiometric: boolean) => {
    try {
      await dispatch(doSignIn({ masterPassword, isBiometric })).unwrap()
      navigateTo()
    } catch (error: any) {
      console.log('error', error)
      setError(error?.message)
    }
  }

  const navigateTo = () => {
    if (action) {
      route.replace(action)
    } else {
      route.replace('/home')
    }
  }

  return (
    <OnboardingLayout>
      <BetaVersionBanner />
      {!error ? <WelcomeBack /> : <WelcomeBackError error={error} />}
      <WelcomeBackFooter onUnlockPress={onUnlockPress} />
    </OnboardingLayout>
  )
}

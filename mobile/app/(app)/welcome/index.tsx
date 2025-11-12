import { useState } from 'react'
import { useRouter } from 'expo-router'
import { selectAction, useAppDispatch, useAppSelector, doSignIn } from '@/redux'
import { WelcomeBackFooter } from '@/modules/ui-components'
import { BetaVersionHeader } from '@/modules/ui-components/molecules'
import { HeroBox, HomeLayout } from '@berty/gnonative-ui'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { SlideImage } from '@/modules/ui-components/atoms'
import { useKeyboard } from '@/hooks/useKeyboard'

export default function Root() {
  const [error, setError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const action = useAppSelector(selectAction)
  const image = require('../../../assets/images/icon.png')
  const { willShow } = useKeyboard()

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
      router.replace(action)
    } else {
      router.replace('/home')
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HomeLayout header={<BetaVersionHeader />} footer={<WelcomeBackFooter onUnlockPress={onUnlockPress} />}>
        {!error ? (
          <HeroBox
            img={!willShow && <SlideImage source={image} resizeMode="contain" />}
            title="Welcome back"
            description="Enter your password to unlock GnoKey Mobile"
          />
        ) : (
          <HeroBox title="Login Error" description={error} />
        )}
      </HomeLayout>
    </KeyboardAvoidingView>
  )
}

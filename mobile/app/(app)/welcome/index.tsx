import { useState } from 'react'
import { useRouter } from 'expo-router'
import { selectAction, useAppDispatch, useAppSelector, doSignIn } from '@/redux'
import { HomeLayout, WelcomeBack, WelcomeBackFooter } from '@/modules/ui-components'
import { WelcomeBackError } from '@/modules/ui-components/organisms/WelcomeBackError'
import { BetaVersionHeader } from '@/modules/ui-components/molecules'
import { KeyboardAvoidingView, Platform } from 'react-native'

export default function Root() {
  const [error, setError] = useState<string | undefined>(undefined)
  const router = useRouter()
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
      router.replace(action)
    } else {
      router.replace('/home')
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HomeLayout header={<BetaVersionHeader />} footer={<WelcomeBackFooter onUnlockPress={onUnlockPress} />}>
        {!error ? <WelcomeBack /> : <WelcomeBackError error={error} />}
      </HomeLayout>
    </KeyboardAvoidingView>
  )
}

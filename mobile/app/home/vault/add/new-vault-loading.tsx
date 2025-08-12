import ActivityIndicator from '@/components/atoms/activity-indicator'
import { OnboardingLayout } from '@/modules/ui-components'
import HeroBox from '@/modules/ui-components/molecules/HeroBox'
import {
  registerAccount,
  selectLastProgress,
  selectSelectedChain,
  signUpStateSelector,
  useAppDispatch,
  useAppSelector,
  VaultCreationState
} from '@/redux'
import { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ButtonBack } from '@/modules/ui-components/molecules'

const Page = () => {
  const signUpState = useAppSelector(signUpStateSelector)
  const currentNetwork = useAppSelector(selectSelectedChain)
  const dispatch = useAppDispatch()
  const progress = useAppSelector(selectLastProgress)

  const [error, setError] = useState<string | undefined>(undefined)

  const params = useLocalSearchParams<{ keyName: string }>()
  const keyName = params?.keyName || 'Updated'

  const [enteredTime, setEnteredTime] = useState(Date.now())

  // useFocusEffect(() => {
  //   setEnteredTime(Date.now())
  // })

  const navigateOnlyAfter3Seconds = (cb: () => void) => {
    const elapsedTime = Date.now() - enteredTime
    if (elapsedTime >= 3000) {
      cb()
    } else {
      setTimeout(() => {
        cb()
      }, 3000 - elapsedTime)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (signUpState === VaultCreationState.user_exists_on_blockchain_and_local_storage) {
        setError('This name is already registered on the blockchain and on this device. Please choose another name.')
        return
      }
      if (signUpState === VaultCreationState.user_already_exists_on_blockchain) {
        setError('This name is already registered on the blockchain. Please, choose another name.')
        return
      }
      if (signUpState === VaultCreationState.user_already_exists_on_blockchain_under_different_name) {
        setError(
          'This account is already registered on the blockchain under a different name. Please press Back and sign up again with another Seed Phrase, or for a normal sign in with a different account if available.'
        )
        return
      }
      if (signUpState === VaultCreationState.user_exists_only_on_local_storage) {
        setError(
          'This name is already registered locally on this device but NOT on chain. If you want to register your account on the Gno Blockchain, please press Register On-Chain. Your seed phrase will remain the same.'
        )
        return
      }
      if (signUpState === VaultCreationState.user_exists_under_differente_key) {
        setError(
          'This name is already registered locally and on the blockchain under a different key. Please choose another name.'
        )
        return
      }
      if (signUpState === VaultCreationState.user_exists_under_differente_key_local) {
        setError('This name is already registered locally under a different key. Please choose another name.')
        return
      }
      if (signUpState === VaultCreationState.account_created) {
        if (currentNetwork?.faucetPortalUrl) {
          navigateOnlyAfter3Seconds(() => router.push('/home/vault/add/external-faucet'))
          return
        }
        if (currentNetwork?.faucetUrl) {
          await dispatch(registerAccount()).unwrap()
          return
        } else {
          navigateOnlyAfter3Seconds(() =>
            router.replace({
              pathname: '/home/vault/add/new-vault-success',
              params: { keyName }
            })
          )
          return
        }
      }
      if (signUpState === VaultCreationState.account_registered) {
        navigateOnlyAfter3Seconds(() =>
          router.replace({
            pathname: '/home/vault/add/new-vault-success',
            params: { keyName }
          })
        )
        return
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState, dispatch])

  return (
    <OnboardingLayout footer={error ? <ButtonBack /> : null}>
      {error ? (
        <HeroBox title="Error" description={error || progress} />
      ) : (
        <HeroBox img={<ActivityIndicator />} title="Loading" description={progress} />
      )}
    </OnboardingLayout>
  )
}

export default Page

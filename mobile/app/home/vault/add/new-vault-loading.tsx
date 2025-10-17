import { HomeLayout, ActivityIndicator, ButtonBack, HeroBox, ErrorBox } from '@/modules/ui-components'
import {
  registerAccount,
  selectLastProgress,
  selectSelectedChain,
  signUpStateSelector,
  useAppDispatch,
  useAppSelector,
  VaultCreationState
} from '@/redux'
import { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

const Page = () => {
  const signUpState = useAppSelector(signUpStateSelector)
  const currentNetwork = useAppSelector(selectSelectedChain)
  const dispatch = useAppDispatch()
  const progress = useAppSelector(selectLastProgress)
  const router = useRouter()

  const [error, setError] = useState<string | undefined>(undefined)

  const params = useLocalSearchParams<{ keyName: string }>()
  const keyName = params?.keyName || 'Updated'

  const navigateOnlyAfter3Seconds = useCallback((cb: () => void) => {
    setTimeout(() => {
      cb()
    }, 3000)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (signUpState === VaultCreationState.generic_error) {
        setError('An unexpected error occurred. Please try again.')
        return
      }
      if (signUpState === VaultCreationState.user_exists_on_blockchain_and_local_storage) {
        setError('This name is already registered on the blockchain and on this device. Please choose another name.')
        return
      }
      if (signUpState === VaultCreationState.user_already_exists_on_blockchain) {
        setError('This name is already registered on the blockchain. Please, choose another name.')
        return
      }
      if (signUpState === VaultCreationState.user_already_exists_on_blockchain_under_different_name) {
        // This account is already registered on the blockchain under a different name.
        router.replace({ pathname: '/home/vault/add/existing-account', params: { existingName: keyName } })
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
    <HomeLayout
      header={null}
      footer={error ? <ButtonBack onPress={() => router.replace({ pathname: '/home/vault/add' })} /> : null}
    >
      {error ? (
        <ErrorBox title="Error" description={error} errorDetails={progress} />
      ) : (
        <HeroBox img={<ActivityIndicator />} title={`Loading`} description={progress} />
      )}
    </HomeLayout>
  )
}

export default Page

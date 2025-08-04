import { Alert as RNAlert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useFocusEffect } from 'expo-router'
import {
  selectMasterPassword,
  useAppDispatch,
  useAppSelector,
  VaultCreationState,
  newAccountSelector,
  registerAccount,
  createKey,
  signUpStateSelector,
  selectKeyName,
  selectPhrase,
  generateNewPhrase,
  fetchVaults,
  checkForKeyOnChains,
  selectLastProgress,
  selectLoadingAddVault,
  selectCurrentChain
} from '@/redux'
import { Button, OnboardingLayout } from '@/modules/ui-components'
import { LoadingModal } from '@/components/loading'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { NewVaultForm } from '@/modules/ui-components/organisms/NewVaultForm'

export default function Page() {
  const [error, setError] = useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()

  const progress = useAppSelector(selectLastProgress)
  const masterPassword = useAppSelector(selectMasterPassword)
  const signUpState = useAppSelector(signUpStateSelector)
  const newAccount = useAppSelector(newAccountSelector)
  const keyName = useAppSelector(selectKeyName)
  const phrase = useAppSelector(selectPhrase)
  const loading = useAppSelector(selectLoadingAddVault)
  const currentChain = useAppSelector(selectCurrentChain)

  useFocusEffect(
    React.useCallback(() => {
      dispatch(generateNewPhrase())
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  // const onResetForm = () => {
  //   dispatch(resetState())
  //   setError(undefined)
  //   dispatch(clearProgress())
  //   dispatch(generateNewPhrase())
  //   inputRef.current?.focus()
  // }

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
        if (currentChain?.faucetPortalUrl) {
          router.push('/home/vault/new-vault/external-faucet')
          return
        }
        if (currentChain?.faucetUrl) {
          await dispatch(registerAccount()).unwrap()
          return
        } else {
          router.replace({
            pathname: '/home/vault/new-vault/new-vault-success',
            params: { keyName }
          })
          return
        }
      }
      if (signUpState === VaultCreationState.account_registered) {
        router.replace({
          pathname: '/home/vault/new-vault/new-vault-success',
          params: { keyName }
        })
        return
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState, newAccount, dispatch])

  const onCreate = async () => {
    setError(undefined)

    if (!keyName) {
      console.error('Key name is required')
      setError('Please fill out all fields')
      return
    }

    if (!phrase) {
      console.error('Seed phrase is required')
      setError('Phrase not found.')
      return
    }

    // Use the same regex and error message as r/gnoland/users/v1
    if (!keyName.match('^[a-z]{3}[_a-z0-9]{0,14}[0-9]{3}$')) {
      setError('Account name must be at least 6 characters, lowercase alphanumeric with underscore')
      return
    }

    if (!masterPassword) {
      setError('Master password not found.')
      return
    }

    try {
      await dispatch(createKey({ name: keyName, password: masterPassword, phrase })).unwrap()
      await dispatch(fetchVaults()).unwrap()
      dispatch(checkForKeyOnChains())
    } catch (error: any) {
      console.log(error)
      const msg = error['message'] || JSON.stringify(error)
      RNAlert.alert('Error', msg)
      setError(msg)
    }
  }

  // To be called when VaultCreationState.user_exists_only_on_local_storage
  // const onRegisterOnChainOnly = async () => {
  //   if (!existingAccount || !keyName || !masterPassword) {
  //     console.error('Some required data is missing to register on-chain.')
  //     return
  //   }
  //   try {
  //     await gnonative.activateAccount(keyName)
  //     await gnonative.setPassword(masterPassword, existingAccount.address)
  //     if (currentChain?.faucetPortalUrl) {
  //       router.push('/home/vault/new-vault/external-faucet')
  //       return
  //     }
  //     await dispatch(registerAccount()).unwrap()
  //   } catch (error: any) {
  //     console.log(error)
  //     const msg = error['message'] || JSON.stringify(error)
  //     RNAlert.alert('Error', msg)
  //     setError(msg)
  //   }
  // }

  return (
    <OnboardingLayout footer={<Button onPress={onCreate}>Create new account</Button>}>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="New account" />
        }}
      />
      <LoadingModal visible={loading} message={progress} />
      <NewVaultForm error={error} />
    </OnboardingLayout>
  )
}

/* <>
          {signUpState === VaultCreationState.user_exists_only_on_local_storage ? (
            <>
              <Button onPress={onRegisterOnChainOnly} style={{ marginTop: 10 }}>
                Register On-Chain
              </Button>
              <Spacer />
              <Button color="secondary" onPress={onResetForm}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onPress={onCreate} style={{ width: '100%' }}>
              Continue
            </Button>
          )}
        </BottonPanel>
      </> 
  */
